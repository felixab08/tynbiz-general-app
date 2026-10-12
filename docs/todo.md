# TODO — Estado

> Última actualización: 2026-10-12.
> Todo lo listado abajo como pendiente se implementó salvo lo explícitamente
> marcado como **[NO IMPLEMENTADO]**. El detalle técnico está en
> `docs/feedback-auth-service.md` (auditoría) y `docs/PRD.md` (requisitos).

## 1. Login

- [x] **Solo `refreshToken` en `localStorage`.** `token` y `user` viven
      únicamente en memoria (signals de `AuthService`, espejados en
      `StoreService`). El token de acceso ya **no** es accesible desde
      `localStorage`, que es lo que expone ante un XSS.
- [x] **Restauración de sesión al recargar.** `provideAppInitializer` +
      `AuthService.bootstrapSession()` canjean el `refreshToken` por un
      `accessToken` nuevo contra `POST /auth/refresh` **antes** de que arranque
      el router. Si el refresh falla, la app arranca como anónimo (no se rompe).
- [x] **`location.reload()` eliminado.** Ya no queda en el login, ni en la
      verificación de email, ni en el logout.
- [x] **Los guards no hacen red.** Antes cada evaluación disparaba
      `checkStatus()`; ahora leen signals. Se eliminó el round-trip por
      navegación y el riesgo de refreshes concurrentes con token rotativo.
- [x] **`isAdmin` corregido.** `role.includes('ADMIN')` (substring) se
      reemplazó por igualdad estricta sobre la unión `UserRole`. El síntoma de
      "siempre `false`" tenía dos causas: el `includes()` sobre `string` y, sobre
      todo, `login.component.ts` declarando `providers: [AuthService]`, que
      creaba una segunda instancia del servicio. Los guards leían la instancia
      raíz, que nunca recibía el usuario.
- [x] **Credenciales incorrectas ya no expulsan al usuario.** Un 401 en
      `/auth/login` muestra el aviso y marca el formulario, sin `logout()`. El
      callback `error:` del componente volvió a ser alcanzable.
- [x] **Un 401 ya no borra la sesión ni recarga la app.** El interceptor intenta
      **un** refresh y reintenta la petición; solo si también falla cierra
      sesión. Se acabaron los bucles de reload y el cierre de sesión espurio que
      provocaba, por ejemplo, un 401 en `GET /notificacionWS/unread`.
- [x] **`logout()` ya no ejecuta `localStorage.clear()`.** Borra solo
      `refreshToken`; los borradores de creación (`creation_creation`) y las
      citas del calendario (`appointments`) dejan de perderse.
- [x] **`logout()` también limpia `StoreService`.** El menú y la redirección por
      rol ya no conservan al usuario tras cerrar sesión.
- [x] **Las claves `token` y `user` del esquema anterior se purgan** en el
      arranque, para que el token de acceso no quede persistido de antigüedad.

### Flowbite y los dropdowns

- [x] **Los dropdown del menú de usuario y de notificaciones se inicializan sin
      `location.reload()`.** Ambos viven dentro de un `@if`, así que su markup
      nace **después** del `initFlowbite()` de `AppComponent.ngOnInit`. La causa
      raíz de "el dropdown no funciona si no recargo" era exactamente esa.
      Ahora `NavbarComponent` los enlaza con un `afterRenderEffect` que corre
      cuando el DOM ya está actualizado, y el login vuelve a inicializar
      Flowbite tras establecer la sesión.

## 2. Roles

| Rol               | Menú lateral                  | Móvil                        | Destino post-login   |
| ----------------- | ----------------------------- | ---------------------------- | -------------------- |
| `CLIENT`          | `menuClient` completo         | `nav#bottom-navigation`      | `/shop/home`         |
| `STORE_OWNER`     | `menuOwner`                   | hamburguesa + drawer         | `/stores/init-store` |
| `ADMIN`           | `menuAdmin`                   | hamburguesa + drawer         | `/admin/panel`       |
| `SUPER-ADMIN`     | `menuAdmin`                   | hamburguesa + drawer         | `/admin/panel`       |
| _(anónimo)_       | `menuClient` **recortado**    | `nav#bottom-navigation`      | `/shop/home`         |

- [x] **Anónimo:** `menuClient` sin "Favoritos" ni "Tu creación" (4 ítems).
- [x] **`CLIENT`:** `menuClient` completo (6 ítems).
- [x] **`ADMIN` y `SUPER-ADMIN`:** `menuAdmin`.
- [x] **`SUPER-ADMIN` soportado de punta a punta.** Antes no coincidía con
      ninguna rama de plantilla (`role === 'ADMIN' || role === 'STORE_OWNER'`),
      así que se veía sin sidebar, sin hamburguesa y con la barra inferior de
      comprador. Ahora `UserRole` es una unión y todas las capas comparan con
      igualdad.

### Corregido de paso

- [x] **`menuClient.splice(0, 4)` mutaba el array compartido.** A partir de la
      segunda llamada el menú del visitante quedaba vacío para todos los
      usuarios. Ahora se construye con `filter` en `menuClientGuest`.
- [x] **`isClient` ya no devuelve `true` para el anónimo** (`|| !this._user()`).
      El caso anónimo se expone aparte como `isAnonymous`. Antes solo era
      inocuo porque `isClientGuard` siempre iba emparejado con
      `isAutenticatedGuard`.
- [x] **`/admin` y `/stores` están protegidos por rol.** `isAdminGuard` e
      `isOwnerGuard` existían pero **nunca se:applyaron**: cualquier usuario
      autenticado, incluso un `CLIENT`, podía entrar a la consola de
      administración.

## 3. Usuarios por defecto

> **[NO IMPLEMENTADO — requiere backend]** Estas cuentas son datos semilla del
> servidor; el frontend no puede crearlas. Se verificó que
> `owner@tynby.com` (`STORE_OWNER`) responde correctamente en
> `/auth/login` contra el backend de producción.
>
> Pendiente del equipo backend:
>
> | Rol           | Email                        | Contraseña  |
> | ------------- | ---------------------------- | ----------- |
> | `CLIENT`      | `qleqjkixwxucxkojjo@vtmpj.com` | (a definir) |
> | `CLIENT`      | `tqnwshyukibnxdlkhp@gonrr.net` | (a definir) |
> | `STORE_OWNER` | `owner@tynby.com`            | (a definir) |
> | `ADMIN`       | `admin@tynby.com`            | (a definir) |
>
> **Pendiente de decisión:** estas credenciales están escritas en un archivo del
> repositorio. Aunque sean cuentas de prueba, conviene moverlas a un gestor de
> secretos o a documentación externa al repo.

## 4. Redirección defectuosa

- [x] **`ADMIN` → `/admin/panel`** (antes iba a `/shop/home`).
- [x] **`STORE_OWNER` → `/stores/init-store`** (antes iba a `/shop/home`).

**Causa raíz de ambos errores:** `LoginComponent` declaraba
`providers: [AuthService]`, creando una segunda instancia. El login escribía en
esa instancia mientras el `authInterceptor` leía la de raíz, con `_token() ===
null`. Resultado: las peticiones salían **sin cabecera `Authorization`**, el
backend respondía 401 y `isLoginInterceptor` ejecutaba `logoutAndReload()`,
que terminaba en `/shop/home`. Los dos síntomas eran el mismo bug.

- [x] `MenuService` ya no cachea el usuario en un campo con una suscripción que
      nunca se cancelaba; deriva de un signal. Tras un logout el menú y la
      redirección ya no conservan al usuario anterior.
