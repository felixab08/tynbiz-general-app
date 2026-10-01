## 1. Login

Estoy intentando mejorar la seguridad de este enfoque. Una idea que estoy considerando es:

guardar un solo valor en el localStorage que contenga un valor refreshToken todo los demas valores:

- Token
- user
  se guarden en el StoreService y evitar usar localStorage por temas de seguridad

si se refresca la pagina (presioanan F5) se hace el llamada de /auth/refresh enviando el cookie y me diga que esta logueado si es valida y no se pierda a sesión.

quiero evitar el location.reload() pero no entiendo porque no esta funcionando ni cargando bien el Flowbite pues cuando no uso location.reload() no funciona Dropdown menu que estan en navbar.component.html, se hace click y despliega el menu.

revisar en auth.service.ts la linea:  
isAdmin = computed(() => {
return this._user()?.role.includes('ADMIN') ?? false;
});

pues no esta funcionando, esta devolviendo false siempre

## 2. Roles

| Rol               | Descripción                           | Destino post-login   |
| ----------------- | ------------------------------------- | -------------------- |
| `CLIENT`          | Comprador / creador social            | `/shop/home`         |
| `STORE_OWNER`     | Dueño de tienda                       | `/stores/init-store` |
| `ADMIN`           | Administrador                         | `/admin/panel`       |
| `SUPER-ADMIN`**   | Administrador superior (sólo sidebar) | `/admin/panel`       |
| _(ninguno)_       | Anónimo                               | `/shop/home`         |

> **Nota: no existe este Rol pero esta pensado para la V2 del proyecto.

- Al abrir la pagina de Tynbiz inicia son rol _(ninguno)_ y se debe tener el menu `menuClient` pero son los 2 ultimos : name: 'Favoritos' y name: 'Tu creación',
- Cuando se logue con rol `CLIENT` se debe mostrar el menu: `menuClient` ya en su totalidad sin recortarlo
- Cuando se logue con el rol `ADMIN` y `SUPER-ADMIN` se debe mostrar el menu `menuAdmin`

## 3. Usuarios por defecto

### 3.1 Cliente

Usuario: qleqjkixwxucxkojjo@vtmpj.com
contraseña: Buyer123!
rol: `CLIENT`

Usuario: tqnwshyukibnxdlkhp@gonrr.net
contraseña: Buyer123!
rol: `CLIENT`

### 3.2 Tienda

Usuario: owner@tynby.com
contraseña: Admin123!
rol: `STORE_OWNER`

### 3.3 Admin

Usuario: admin@tynby.com
contraseña: Admin123!
rol: `ADMIN`

## 4. Redirección defectuoso
Error 1: Se esta viendo que cuando al loguearse con usuario  `ADMIN` la redirección se va a `/shop/home` y no a `/admin/panel` como debe ser
Error 2: Se esta viendo que cuando al loguearse con usuario  `STORE_OWNER` la redirección se va a `/shop/home` y no a `/stores/init-store` como debe ser
