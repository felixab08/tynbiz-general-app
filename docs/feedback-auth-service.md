# Feedback — `AuthService`

**Archivo revisado:** `src/app/auth/services/auth.service.ts`
**Fecha:** 2026-10-01
**Contexto:** Angular 22.1 · TypeScript ~6.0.3 · Tailwind 4.3 · `HashLocationStrategy`
**Alcance:** auditoría completa del servicio y de su superficie de consumo
(interceptores, guards, `StoreService`, `MenuService`, componentes que lo inyectan).

---

## 1. Resumen ejecutivo

`AuthService` funciona en la práctica, pero lo hace por accidente más que por diseño. Hay
**2 bugs reales de producción**, varios problemas de arquitectura que se amplifican en cascada
y una capa de higiene difícil de mantener.

| Severidad | Cantidad | Descripción |
| --------- | -------- | ----------- |
| 🔴 Crítico | 2 | Rompen funcionalidad observable |
| 🟠 Alto | 6 | Comportamiento incorrecto o frágil |
| 🟡 Medio | 9 | Mantenibilidad, tipado, consistencia |
| ⚪ Bajo | 11 | Higiene de código y estilo |

### Los dos bugs críticos

1. **`checkStatus()` no ejecuta la petición HTTP.** La línea 134 llama a `refreshTokenUser(...)`
   y **descarta el Observable sin suscribirse**. Como los Observables de `HttpClient` son cold,
   la llamada a `/auth/refresh` **nunca sale a la red**. El `try/catch` que lo envuelve no puede
   capturar errores asíncronos, así que es código muerto. Los guards reciben `of(true)` de forma
   síncrona basado solo en que exista la clave en `localStorage`.

2. **`handleAuthError()` se dispara en login fallido y hace `logout()`.** Un 401 por contraseña
   incorrecta provoca `localStorage.clear()` y una navegación a `/shop/home`. El usuario que
   simplemente se equivocó de contraseña es expulsado de la aplicación. Además, como
   `catchError` devuelve `of(false)`, el callback `error:` del consumidor
   (`login.component.ts:77`) **nunca se ejecuta** — es código muerto.

### El hallazgo que conecta casi todo

`login.component.ts:26` declara `providers: [AuthService]`, lo que crea una **segunda instancia**
del servicio. El login escribe en los signals de la instancia del componente, mientras que los
guards y los interceptores inyectan la instancia raíz, donde `_user()` y `_token()` siguen en
`null`. Esto explica:

- Por qué `isAdmin()` "siempre devuelve `false`" (`docs/todo.md` §1) — la instancia que
  consulta el guard nunca recibió el usuario.
- Por qué el código está lleno de `location.reload()` después del login — el reload es lo que
  "sincroniza" ambas instancias a costa de perder todo el estado de la SPA.
- Por qué el `Authorization: Bearer` no se adjunta en las peticiones post-login.

---

## 2. 🔴 Críticos

### C-1. `checkStatus()` descarta el Observable: el refresh nunca se ejecuta

**Ubicación:** líneas 133-140

```ts
try {
  this.refreshTokenUser(refreshToken as string);  // ← Observable descartado
  return of(true);
} catch (error) {
  console.error('Error al restaurar usuario:', error);
  this.logout();
  return of(false);
}
```

**Problema.** `refreshTokenUser()` devuelve un Observable cold. Sin `.subscribe()` no se
dispara ninguna petición. Peor: el `try/catch` es inútil, porque los errores de una operación
asíncrona nunca se propagan de forma síncrona. La rama `catch` es código muerto.

**Consecuencia.** `checkStatus()` degenera en `localStorage.getItem('token') !== null`. Los cuatro
guards (`isAutenticated`, `isAdmin`, `isOwner`, `isClient`) dan por válida una sesión que el
servidor puede haber revocado. El `refreshToken` persistido nunca se usa para nada.

**Además.** Si `refreshToken` es `null` — perfectamente posible con el estado actual de las
escrituras parciales descritas en A-4 — el cast `as string` miente y se enviaría
`{ refreshToken: null }` al backend.

**Fix.**

```ts
checkStatus(): Observable<boolean> {
  if (!this._token() || !this._user()) {
    this.clearSession();
    return of(false);
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    this.clearSession();
    return of(false);
  }

  return this.refreshTokenUser(refreshToken).pipe(
    switchMap(() => of(true)),
    startWith(true), // optimista: la sesión local es válida hasta que el servidor diga lo contrario
  );
}
```

> Nota: `startWith(true)` mantiene el comportamiento actual de no bloquear la navegación. Si
> prefieres validación estricta, quítalo y el guard esperará la respuesta real del servidor.

### C-2. `handleAuthError()` hace `logout()` en un login fallido

**Ubicación:** líneas 172-182

```ts
private handleAuthError(error: IErrorGeneralResp) {
  this.logout();                       // ← borra sesión y navega
  this._alertService.getAlert(
    'Login',
    error.error.detail || 'Error al iniciar sesión',
    'warning',
  );
  return of(false);
}
```

**Problema doble.**

1. **UX destructivo.** Un `401` por credenciales incorrectas es el error *más esperado* del flujo
   de login. Ejecutar `logout()` en ese caso borra `localStorage` completo y redirige a
   `/shop/home`, expulsando al usuario de la pantalla de login.
2. **El callback `error:` del consumidor es código muerto.** Como `catchError` retorna
   `of(false)`, el stream nunca entra en error. En `login.component.ts:62-89`, todo el bloque
   `error: (error) => { ... this.myForm.setErrors({ loginFailed: true }); ... }` es inalcanzable.

**Fix.** Separar el handler de login del de refresh, y no hacer logout en un fallo de
credenciales:

```ts
private handleLoginError(error: HttpErrorResponse): Observable<never> {
  this._alertService.getAlert(
    'Login',
    (error.error as IErrorResp)?.detail || 'Error al iniciar sesión',
    'warning',
  );
  return throwError(() => error); // el consumidor decide qué hacer
}

private handleRefreshError(): Observable<never> {
  this.clearSession(); // aquí sí: el refresh falló, la sesión no es recuperable
  return throwError(() => new Error('Session refresh failed'));
}
```

Y en `login()`:

```ts
login(username: string, password: string): Observable<boolean> {
  return this.http
    .post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: username,
      password,
    })
    .pipe(
      map((data) => this.handleAuthSuccess(data.user, data.accessToken, data.refreshToken)),
      catchError((error: HttpErrorResponse) => this.handleLoginError(error)),
    );
}
```

Esto además **reactiva el `error:` handler del componente**, que vuelve a ser funcional.

---

## 3. 🟠 Altos

### A-1. `LoginComponent` re-provee `AuthService`: dos instancias, estado partido

**Ubicación:** `login.component.ts:26`

```ts
@Component({
  // ...
  providers: [AuthService],  // ← segunda instancia
})
```

**Problema.** El componente recibe su propia instancia. `handleAuthSuccess()` se ejecuta sobre
esa instancia, actualizando únicamente sus signals privados y escribiendo en `localStorage`. La
instancia raíz — la que inyectan `auth.interceptor.ts:11` y los cuatro guards — nunca ve esos
cambios: su `_token()` sigue siendo `null`.

**Consecuencias (todas verificables en el código):**

| Síntoma | Causa |
| ------- | ----- |
| `isAdmin()` siempre `false` (`docs/todo.md` §1) | El guard lee la instancia raíz, sin usuario |
| `Authorization` no se adjunta post-login | `auth.interceptor.ts:12` lee `authService.token()` de la raíz → `null` |
| `location.reload()` en `login.component.ts:67-69` | El reload "arregla" el estado a costa de perder la SPA |
| `isAutenticatedGuard` inconsistente | Señales divergentes entre instancias |

**Fix.** Eliminar `providers: [AuthService]`. El servicio es `providedIn: 'root'`; no hay razón
para re-proveerlo.

```ts
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  /* sin providers */
}
```

Con esto desaparece la necesidad del `location.reload()` post-login, que es la causa raíz del
problema de Flowbite mencionado en `docs/todo.md` §1.

### A-2. `logout()` usa `localStorage.clear()` y borra estado no relacionado

**Ubicación:** línea 147

```ts
logout() {
  // ...
  localStorage.clear();  // ← borra TODO el origin
}
```

**Problema.** La app guarda estado no-autenticado en `localStorage`:

| Clave | Archivo |
| ----- | ------- |
| `creation_creation` | `create-creation-store-page.component.ts:111` |
| appointments | `create-calendar.ts:115`, `create-calendar-modal.ts:156` |
| products (`STORAGE_KEY`) | `create-creation.service.ts:30` |

Un logout borra borradores de creación y citas del calendario del dueño de tienda. Es pérdida
de datos silenciosa.

**Fix.**

```ts
private static readonly STORAGE_KEYS = ['token', 'user', 'refreshToken'] as const;

logout(): void {
  this.clearSession();
  this._router.navigate(['/shop/home']);
}
```

donde `clearSession()` (ver M-4) hace los `removeItem` selectivos.

### A-3. `logout()` no limpia `StoreService`: `MenuService` conserva el usuario

**Ubicación:** líneas 143-149

`StoreService` mantiene `user`, `isLoginSubject`, `refreshTokenSubject` y `tokenSubject`.
`logout()` solo limpia los signals privados de `AuthService`. Como `MenuService:16-19` cachea
`this.user` desde una suscripción que nunca se cancela, tras un logout:

- `createMenuForRole()` sigue devolviendo `menuAdmin` para un usuario que acaba de cerrar sesión.
- `redirectLinkForRole()` sigue redirigiendo a `/admin/panel`.

**Fix.** Limpiar el store en `clearSession()`:

```ts
this.storeService.user.next(undefined);
this.storeService.isLoginSubject.next(false);
this.storeService.refreshTokenSubject.next(null);
this.storeService.tokenSubject.next(null);
```

### A-4. `handleAuthSuccess()` no empuja `tokenSubject` / `refreshTokenSubject`

**Ubicación:** líneas 158-170

`initializeAuthState()` (línea 70) sí empuja `refreshTokenSubject`, pero `handleAuthSuccess()` —
que es el camino del login normal y el de `verification.ts:36` — **no empuja ninguno de los dos**.

**Consecuencia.** `JitsiService:29-34` se suscribe a ambos subjects. Tras un login fresco (sin
reload) ambos siguen en `null`, y `connectWebSocket()` retorna temprano en
`if (!this.token)`. Esto confirma y amplía la nota de `AGENTS.md`: el problema no es solo que
`tokenSubject` nunca se empuje, es que **ninguno de los dos subjects se sincroniza en el camino
de login**, y por tanto `refreshToken` puede estar ausente en `localStorage` (ver C-1).

**Fix.** Centralizar las escrituras:

```ts
public handleAuthSuccess(user: User, token: string, refreshToken: string): boolean {
  this._user.set(user);
  this._token.set(token);
  this._authStatus.set('authenticated');

  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);

  // Sincroniza StoreService (JitsiService depende de estos dos subjects).
  this.storeService.user.next(user);
  this.storeService.tokenSubject.next(token);
  this.storeService.refreshTokenSubject.next(refreshToken);

  return true;
}
```

Nota el cambio de `this._user() as User` por el parámetro `user` directo: el cast era
innecesario y frágil.

### A-5. `isClient` devuelve `true` para usuarios anónimos

**Ubicación:** líneas 188-194

```ts
private typeCliente(): boolean {
  if (this._user()?.role.includes('CLIENT') || !this._user()) {
    return true;   // ← sin usuario → true
  } else {
    return false;
  }
}
```

**Problema.** La guarda `|| !this._user()` hace que un visitante sin sesión pase el chequeo de
"es cliente". Hoy no es explotable solo porque `isClientGuard` siempre se usa emparejado con
`isAutenticatedGuard` (`shopper.routes.ts:29,42`) — pero es una trampa: cualquier uso futuro de
`isClientGuard` en solitario abriría la ruta a cualquiera.

**Además.** `isClient` (líneas 50-52) aplica `?? false` sobre un método que ya devuelve
`boolean`. El `??` es código muerto.

**Fix.** Eliminar el caso anónimo del chequeo de rol:

```ts
isClient = computed(() => this._user()?.role.includes('CLIENT') ?? false);
```

Si necesitas distinguir "anónimo" de "cliente", exponlo explícitamente:

```ts
readonly isAnonymous = computed(() => this._user() === null);
```

### A-6. `role.includes(...)` es un substring match, inconsistente con el resto del código

**Ubicación:** líneas 45, 48, 189

`User.role` está tipado como `string`, así que `.includes()` es `String.prototype.includes` — una
búsqueda de subcadena, no una comparación de rol.

**Inconsistencias concretas:**

| Ubicación | Semántica | Resultado para `SUPER-ADMIN` |
| --------- | --------- | ----------------------------- |
| `auth.service.ts:45` `isAdmin` | substring | `true` |
| `menu.service.ts:26,42` `switch (role)` | igualdad estricta | `default` → `menuClient` |
| `navbar.component.html:4,115` `role === '...'` | igualdad estricta | `false` |
| `side-menu.component.html:205-206` | igualdad estricta | `false` |

`docs/todo.md` §2 especifica que `SUPER-ADMIN` **debe** ver `menuAdmin`. Hoy `isAdmin()` dice
`true` pero `MenuService` le sirve `menuClient`.

**Fix.** Tipar el rol como unión y comparar con igualdad:

```ts
// user.interface.ts
export type UserRole = 'ADMIN' | 'SUPER-ADMIN' | 'STORE_OWNER' | 'CLIENT';

export interface User {
  // ...
  role: UserRole;
}
```

```ts
// auth.service.ts
isAdmin = computed(() => {
  const role = this._user()?.role;
  return role === 'ADMIN' || role === 'SUPER-ADMIN';
});
isOwner = computed(() => this._user()?.role === 'STORE_OWNER');
isClient = computed(() => this._user()?.role === 'CLIENT');
```

Esto también convierte los errores de rol futuros en errores de compilación en lugar de
comparaciones silenciosamente falsas.

---

## 4. 🟡 Medios

### M-1. `checkStatusResource` está declarado y nunca se lee

**Ubicación:** líneas 31-33

Verificado con grep sobre todo `src/`: `checkStatusResource` solo aparece en su declaración.
Ningún componente, template ni guard lo consume.

Peor aún: su `stream` llama a `checkStatus()`, que **no es puro** — muta signals, puede llamar
`logout()` y navegar. Encapsular un efecto con navegación dentro de un resource es un
antipatrón: si alguien llega a leerlo, dispara navegación desde un contexto de resource.

**Fix.** Eliminarlo. Si más adelante se necesita estado de carga para la UI, modelarlo
explícitamente con un signal, no con un resource que tenga efectos.

### M-2. Triple fuente de verdad para el estado de sesión

El estado de sesión vive en tres sitios que pueden divergir:

1. Signals privados: `_token`, `_user`, `_authStatus`
2. `localStorage`: `token`, `user`, `refreshToken`
3. `StoreService`: `user`, `tokenSubject`, `refreshTokenSubject`

`checkStatus()` (líneas 124-126) lee directamente de `localStorage` en vez de usar
`this._token()` / `this._user()`, lo que añade una cuarta lectura. Y `navbar.component.ts:50`,
`stores-card.component.ts:25`, `profile.component.ts:21` hacen
`JSON.parse(localStorage.getItem('user'))` por su cuenta, sin pasar por el servicio.

**Fix (gradual).** Hacer que los signals sean la única fuente en memoria y usar
`linkedSignal` para la hidratación desde `localStorage`:

```ts
private readonly storedUser = signal<string | null>(localStorage.getItem('user'));

readonly user = linkedSignal<User | null>(() => {
  const raw = this.storedUser();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
});
```

### M-3. `authStatus` nunca es observablemente `'checking'`

**Ubicación:** líneas 23, 35-39, 53-78

`_authStatus` se inicializa a `'checking'` en el declarador del campo, pero el constructor
llama a `initializeAuthState()` inmediatamente después, que siempre lo sobreescribe con
`'authenticated'` o `'not-authenticated'`. Como los consumidores no pueden observar la ventana
intermedia, el estado `'checking'` es inalcanzable en la práctica.

Además, `authStatus` es un `computed` que ya deriva de `_user()` y `_token()`. El signal
`_authStatus` es redundante: solo se usa para el caso `'checking'`, que no ocurre.

**Fix.** Eliminar `_authStatus` y dejar que `authStatus` derive únicamente de los datos:

```ts
readonly authStatus = computed<AuthStatus>(() => {
  if (!this._user() || !this._token()) return 'not-authenticated';
  return 'authenticated';
});
```

Si necesitas un estado de carga real, modelarlo con un signal dedicado
(`private readonly _initializing = signal(true)`) que el bootstrap de la app ponga en `false`.

### M-4. `logout()` navega desde dentro de un `canMatch` guard

**Ubicación:** `logout()` línea 148, invocado por `checkStatus()` línea 129, invocado por los guards

Cuando `checkStatus()` no encuentra token, llama a `logout()`, que hace
`this._router.navigate(['/shop/home'])`. Eso dispara una navegación **durante la evaluación de
un `canMatch`**, que luego retorna `false` y el router intenta su propio redirect. El resultado
son dos navegaciones compitiendo, y potencialmente un `NavigationCancelingError`.

**Fix.** Separar "limpiar estado" de "navegar":

```ts
/** Limpia el estado. NO navega. Seguro de llamar desde guards. */
clearSession(): void {
  this._user.set(null);
  this._token.set(null);
  this._authStatus.set('not-authenticated');
  this.storeService.user.next(undefined);
  this.storeService.isLoginSubject.next(false);
  this.storeService.refreshTokenSubject.next(null);
  this.storeService.tokenSubject.next(null);
  AuthService.STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

/** Limpia y redirige. Para uso del componente / interceptor. */
logout(): void {
  this.clearSession();
  this._router.navigate(['/shop/home']);
}
```

Y en `checkStatus()` usar `clearSession()` en lugar de `logout()`.

### M-5. `logoutAndReload()` usa `location.reload()` como estrategia de recuperación

**Ubicación:** líneas 151-156

```ts
logoutAndReload() {
  this.logout();
  setTimeout(() => { location.reload(); }, 500);
}
```

El reload completo descarta el estado de la SPA, reinicializa Flowbite (el problema documentado
en `docs/todo.md` §1) y descarta cualquier estado no serializado. Con A-1 resuelto y el refresh
implementado correctamente (C-1), la mayoría de los 401 son recuperables sin reload.

**Fix.** Como mínimo, evitar el global `location` (rompe con SSR futuro) inyectando `DOCUMENT`:

```ts
private readonly document = inject(DOCUMENT);

logoutAndReload(): void {
  this.logout();
  this.document.defaultView?.location.reload();
}
```

La eliminación completa del reload debería ir al final, una vez que A-1 y C-1 estén resueltos.

### M-6. `isLoginInterceptor` no distingue un 401 de refresh de otros 401

**Ubicación:** `token.interceptor.ts:19-23`

```ts
if (error.status === 401 && req.url.split('/').pop() !== 'login') {
  _authService.logoutAndReload();
}
```

Cuando C-1 esté arreglado, un 401 del propio `/auth/refresh` disparará `logoutAndReload()`.
Combinado con `location.reload()`, que vuelve a disparar el refresh al arrancar, se obtiene un
**bucle de reload**: refresh → 401 → reload → refresh → 401 → …

**Este bug está latente porque C-1 impide que el refresh se ejecute.** Arreglar C-1 sin
arreglar esto introduce un loop. Resuélvelos juntos.

**Fix.** Excluir también el endpoint de refresh:

```ts
export function isLoginInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const lastSegment = req.url.split('/').pop();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = lastSegment === 'login' || lastSegment === 'refresh';
      if (error.status === 401 && !isAuthEndpoint) {
        authService.logoutAndReload();
      }
      return throwError(() => error);
    }),
  );
}
```

### M-7. Los guards disparan un round-trip en cada evaluación

**Ubicación:** los cuatro guards, `await firstValueFrom(authService.checkStatus())`

`CanMatchFn` se evalúa en cada navegación. Con el refresh implementado (C-1), cada navegación a
una ruta protegida generará un POST a `/auth/refresh`. Un usuario navegando rápido dispara
múltiples refreshes concurrentes; si el backend rota refresh tokens, el segundo uso del token
anterior falla y cierra la sesión.

**Fix.** Compartir la petición con `shareReplay`:

```ts
private refreshInFlight$: Observable<boolean> | null = null;

checkStatus(): Observable<boolean> {
  this.refreshInFlight$ ??= this.doRefresh().pipe(
    finalize(() => (this.refreshInFlight$ = null)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
  return this.refreshInFlight$;
}
```

Mejor aún: ejecutar el bootstrap de sesión **una vez** al arrancar con `provideAppInitializer`,
y que los guards solo lean signals. Eso elimina la red del camino de navegación por completo.

### M-8. `catchError((error: any) => ...)` con `any` y tipo `IErrorGeneralResp` incorrecto

**Ubicación:** líneas 100, 119, 172

Dos problemas:

1. `(error: any)` anula el tipado. Debería ser `HttpErrorResponse`.
2. `handleAuthError(error: IErrorGeneralResp)` declara un tipo que **nunca es el real**. Lo que
   llega es un `HttpErrorResponse`. La firma solo "funciona" porque ambas estructuras tienen un
   campo `error`, y `HttpErrorResponse.error` contiene el body del servidor.

`IErrorGeneralResp` (`interfaces/general/error.interface.ts:1`) es estructuralmente un `Response`,
no un error de Angular. Además no cubre el caso de red caída, donde `error.error` es `null` y
`error.error.detail` lanza dentro del propio handler de error.

**Fix.**

```ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IErrorResp } from '@app/interfaces';

private handleLoginError(error: HttpErrorResponse): Observable<never> {
  const detail = (error.error as IErrorResp | undefined)?.detail;
  this._alertService.getAlert('Login', detail || 'Error al iniciar sesión', 'warning');
  return throwError(() => error);
}
```

### M-9. `console.log` filtra tokens al navegador

**Ubicación:** líneas 89, 112, 179

```ts
console.log('User found:', data);  // ← AuthResponse completo: accessToken, refreshToken
```

`AuthResponse` incluye `accessToken` y `refreshToken`. Registrarlos en la consola del navegador
los expone a cualquier persona con acceso a DevTools, y a herramientas de grabación de sesión.
`console.log(error)` en `handleAuthError` puede filtrar el body de respuesta de un 401.

**Fix.** Eliminar los logs de payload. Si hacen falta durante desarrollo, registrar solo campos
no sensibles:

```ts
console.debug('[auth] login ok', { userId: data.user.id, expiresIn: data.expiresIn });
```

---

## 5. ⚪ Bajos (higiene)

### B-1. Imports sin uso

`IRefreshToken` (línea 8) se importa y nunca se usa. `tap` (línea 4) se importa y nunca se usa.
`strict: true` está activo en `tsconfig.json` pero `noUnusedLocals` no, así que el build no los
detecta.

### B-2. `_menuService` inyectado y nunca usado

**Ubicación:** línea 27

`MenuService` se inyecta pero no se usa en ninguna parte de la clase. Es una dependencia
innecesaria que además acopla `AuthService` a `MenuService` sin motivo.

### B-3. `computed(this._token)` y `computed(() => this._user())` son redundantes

**Ubicación:** líneas 41-42

Envolver un signal en un `computed` no aporta nada. `asReadonly()` es la forma idiomática y
además impide que los consumidores escriban en el signal.

```ts
readonly user = this._user.asReadonly();
readonly token = this._token.asReadonly();
```

### B-4. `if (data)` y `throw new Error('User not found')` son inalcanzables

**Ubicación:** líneas 87-99, 110-118

`HttpClient` solo emite si el status es 2xx, así que `data` nunca es falsy. La rama `else` nunca
se ejecuta, y ese error genérico terminaría en `handleAuthError` con un mensaje de login para un
problema de parseo.

```ts
map((data) => this.handleAuthSuccess(data.user, data.accessToken, data.refreshToken)),
```

### B-5. `refreshTokenUser` devuelve `Observable<boolean | void>`

**Ubicación:** línea 104

`void` en una unión de tipos no aporta nada. El `map` no tiene `return` en su rama `if`, así que
emite `undefined` implícitamente en el camino de éxito.

```ts
refreshTokenUser(refreshToken: string): Observable<boolean> {
  return this.http
    .post<AuthResponse>(`${baseUrl}/auth/refresh`, { refreshToken })
    .pipe(
      map((data) => this.handleAuthSuccess(data.user, data.accessToken, refreshToken)),
      catchError((error: HttpErrorResponse) => this.handleRefreshError()),
    );
}
```

### B-6. `handleAuthSuccess` es público y usado desde fuera

**Ubicación:** línea 158, llamada en `verification.ts:36`

Está bien que sea pública, pero el nombre no comunica que tiene efectos: escribe en
`localStorage`, en signals y en `StoreService`. Un nombre como `establishSession()` documentaría
la intención.

### B-7. Falta el tipo de retorno en varios métodos públicos

`logout()` (143), `logoutAndReload()` (151) y `postRegisterBuyerUser()` (184) no declaran tipo de
retorno. El último además infiere `Observable<Object>`.

```ts
postRegisterBuyerUser(register: IRegisterReq): Observable<AuthResponse> { /* ... */ }
```

### B-8. Asimetría de tipos entre signals y store

`StoreService.user` es `BehaviorSubject<User | undefined>`, mientras `_user` es
`signal<User | null>`. La asimetría obliga al cast `this._user() as User` en la línea 161.
Unificar ambos a `User | null` elimina el cast.

### B-9. `constructor()` con efectos de lado

**Ubicación:** líneas 53-56

El constructor solo llama a `initializeAuthState()`. Con signals, la idiomática es un field
initializer o directamente el `linkedSignal` de M-2. El constructor no aporta nada aquí.

### B-10. `localStorage` en un inicializador de campo

**Ubicación:** línea 25

```ts
private _token = signal<string | null>(localStorage.getItem('token'));
```

Acceso a `localStorage` en la inicialización de un campo. Funciona en el navegador, pero rompe
con SSR/prerendering. Si el proyecto sigue siendo CSR-only, está bien; si alguna vez se
prerenderiza, hay que inyectar `PLATFORM_ID` y ramificar:

```ts
private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
private readonly _token = signal<string | null>(
  this.isBrowser ? localStorage.getItem('token') : null,
);
```

### B-11. `environment` importado por ruta absoluta en vez de alias

**Ubicación:** línea 3

```ts
import { environment } from 'src/environments/environment';
```

El proyecto define el alias `@environments/*`. `AGENTS.md` documenta que `auth.service.ts` y
`auth.interceptor.ts` usan la ruta directa a propósito, así que es una excepción consciente —
pero conviene que sea explícita, porque el `fileReplacements` de Angular solo resuelve
correctamente si la resolución es consistente.

---

## 6. Plan de remediación sugerido

El orden importa: **A-1 y C-1 juntos, o el bucle de reload de M-6 se vuelve real.**

### Fase 1 — Bugs de producción

1. **A-1**: quitar `providers: [AuthService]` de `login.component.ts`.
2. **C-1**: suscribir el refresh en `checkStatus()`, con guarda de `refreshToken` nulo.
3. **M-6**: excluir `/auth/refresh` del disparador de `logoutAndReload()`.
4. **C-2**: separar `handleLoginError` de `handleRefreshError`; dejar de propagar `of(false)`.
5. **A-2 / A-3 / M-4**: `removeItem` selectivo, limpiar `StoreService`, separar
   `clearSession()` de `logout()`.

### Fase 2 — Coherencia de rol

6. **A-6**: tipar `UserRole` como unión y comparar con igualdad.
7. **A-5**: `isClient` sin el caso anónimo; exponer `isAnonymous` aparte.
8. **A-4**: centralizar las escrituras a `StoreService` en `handleAuthSuccess`.

### Fase 3 — Arquitectura

9. **M-7**: `shareReplay` en el refresh, o migrar el bootstrap a `provideAppInitializer`.
10. **M-2**: `linkedSignal` para la hidratación; eliminar las lecturas paralelas de `localStorage`
    en componentes.
11. **M-1 / M-3**: eliminar `checkStatusResource` y `_authStatus`.
12. **M-8**: `HttpErrorResponse` en lugar de `IErrorGeneralResp` y `any`.

### Fase 4 — Higiene

13. **B-1 a B-11**: imports muertos, `asReadonly()`, tipos de retorno, unificación de
    `User | null` vs `User | undefined`.
14. **M-9**: eliminar los `console.log` con tokens.
15. **M-5**: reevaluar `location.reload()` una vez que A-1 esté resuelto — probablemente
    innecesario, lo que también resuelve el problema de Flowbite de `docs/todo.md` §1.

---

## 7. Lo que está bien

- Uso de signals y `computed` para el estado de sesión: la dirección es correcta, y las signals
  derivadas (`isAdmin`, `isOwner`, `isClient`) son el patrón adecuado.
- `providedIn: 'root'` con `inject()` en field initializers: idiomático en Angular 22.
- `checkStatus()` síncrono desde la perspectiva del guard evita spinners de navegación — el
  diseño es bueno; la implementación es lo que falla.
- Separar `authInterceptor` (adjunta el token) de `isLoginInterceptor` (maneja el 401) como
  interceptores funcionales separados es correcto y más testeable que un interceptor de clase.
- `AuthResponse` incluye `expiresIn`, que provee la base para un refresh proactivo en vez de
  reactivo.

---

## 8. Verificación

El único paso de verificación real del proyecto es:

```bash
npm run build:prod
```

Typecheckea TypeScript **y** templates (`strictTemplates: true`). No hay `lint`, `typecheck` ni
`format`. `npm test` no es un gate: el único spec del repo es el scaffold del CLI, que ya falla
y no debe "arreglarse" para ponerlo en verde.

Para los cambios de rol (A-6), la comprobación relevante es que los tipos compilen: si algún
lugar asigna un rol fuera de la unión, el build falla, que es exactamente el objetivo.

---

*Feedback generado con la skill `angular-developer`, contra Angular 22.1. Las recomendaciones
siguen las convenciones del repo: sin NgModules, componentes standalone,
`ChangeDetectionStrategy.Eager`, identificadores de dominio en español, y respetando la
estrategia de estado existente en `StoreService` en lugar de introducir un store nuevo.*
