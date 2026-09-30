# PRD — Tynbiz General App

**Producto:** Tynbiz — Marketplace de comercio social con compras en vivo
**Documento:** Product Requirements Document v1.0
**Estado:** Vigente (refleja el estado real del código a 2026-09-30)
**Propietario:** Frontend / Producto Tynbiz
**Repositorio:** `tynbiz-general-app` · rama `main`

---

## 1. Resumen ejecutivo

Tynbiz es una **plataforma SaaS de marketplace** que conecta a tres actores:

| Actor                           | Rol de sistema          | Descripción                                                                                                                                                            |
| ------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comprador / creador social**  | `CLIENT`                | Explora tiendas, descubre transmisiones en vivo y participa en compras colectivas por videollamada.                                                                    |
| **Dueño de tienda**             | `STORE_OWNER`           | Conecta su e-commerce (WordPress / Shopify), importa su catálogo, publica "creaciones" (contenidos en vivo o publicados) y gestiona citas, calendario y suscripciones. |
| **Administrador de plataforma** | `ADMIN` / `SUPER-ADMIN` | Opera el marketplace: usuarios, roles, tiendas, planes, suscripciones, ingresos, estadísticas, documentos legales y auditoría.                                         |

**Diferencial:** la unidad comercial no es el SKU aislado sino la **"creación"** — una sala de video (Jitsi, self-hosted) en la que un grupo de compradores y/o el dueño de la tienda **recorren juntos** un catálogo curado de hasta 5 productos en tiempo real.

**Naturaleza del entregable actual:** este documento es un PRD **derivado del código** (`src/`), no de un backlog histórico. Las secciones de "requisitos" reflejan lo que el producto hace hoy; las secciones marcadas como **[HUECO]**, **[BETA]** o **[ROTO]** corresponden a funcionalidad incompleta, mockeada o defectuosa y por tanto constituyen el backlog prioritario (Sección 15).

**Mercado objetivo:** Perú (DNI, RUC, ubigeo departamento/provincia/distrito, soles, Niubiz, MercadoPago).

---

## 2. Problema y oportunidad

### 2.1 Problemas que resuelve

| #   | Problema                                                                                                  | Solución Tynbiz                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| P1  | La compra online es asíncrona: la ficha de producto no transmite confianza ni contexto.                   | Transmitir en vivo la experiencia de tienda con el vendedor y otros compradores.                              |
| P2  | Las tiendas pequeñas no tienen herramientas de marketing directo ni pueden vender fuera de su propia web. | Tynbiz les da un marketplace y un estudio de creación sin que tengan que salir de su backend de e-commerce.   |
| P3  | La conversión de catálogo se pierde por fricción de pago y logística.                                     | El comprador llega acompañado (invita a su sala) y ya vio el producto en contexto, lo que reduce la fricción. |
| P4  | El comprador no tiene un espacio social de descubrimiento.                                                | "Creaciones" públicas y privadas, con métricas de espectadores, participantes e invitaciones.                 |
| P5  | Las visitas son efímeras: no quedan registradas.                                                          | Calendario de citas, recordatorios vía WebSocket, historial de facturación y métricas por creación.           |

### 2.2 Oportunidad de negocio

El modelo de monetización implementado es **SaaS por suscripción a la tienda**, con planes administrables desde la consola de administración:

- Suscripción mensual/anual por tienda (`billingCycle`, `price`, `currency`).
- Límites por plan: `maxUsers`, `maxStorageGb`, `maxProducts`, `maxTransactionsPerMonth`.
- Período de prueba (`freeTrialMonths`, `trialDays`).
- Promociones (`promotion`, `discountPercentage`, `discountDays`).
- Cobro por factura con dos pasarelas: **Niubiz** y **MercadoPago**.

---

## 3. Personas y necesidades

### 3.1 Persona A — Comprador / Creador social (`CLIENT`)

- **Objetivo:** encontrar tiendas, ver sus transmisiones, comprar y compartir la experiencia con amigos.
- **Personas clave:** redes sociales, recommendation de amigos.
- **Necesidades:** descubrimiento por categoría y geografía, favoritos, acceso rápido a "mis creaciones" (salas en las que participa o hospeda), y una compra sin fricción.
- **Frustraciones:** contenido estático, no saber qué tienda es confiable, no poder ver el producto en contexto.

### 3.2 Persona B — Dueño de tienda (`STORE_OWNER`)

- **Objetivo:** vender desde Tynbiz sin abandonar su plataforma de e-commerce existente.
- **Necesidades:** conectar catálogo (WordPress/Shopify), crear y publicar creaciones, gestionar clientes en sala, confirmar citas, configurar su disponibilidad, ver y pagar su suscripción.
- **Frustraciones:** no querer recatalogar productos; no saber si le conviene cambiar de plan; perder ventas por falta de agenda.

### 3.3 Persona C — Administrador de plataforma (`ADMIN`)

- **Objetivo:** operar el marketplace con trazabilidad y control comercial.
- **Necesidades:** altas/bajas/suspensiones de usuarios y tiendas, gestión de planes y roles, seguimiento de ingresos y suscripciones, auditoría de acciones, control de documentos legales (privacidad / términos).
- **Frustraciones:** falta de visibilidad de métricas; datos de soporte dispersos (demo requests, subscription requests).

---

## 4. Propuesta de valor

> **"Comercia en vivo, con tu tienda y tu gente, sin salir de tu plataforma."**

| Persona    | Propuesta de valor                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Comprador  | "Mira y compra productos con el vendedor y tus amigos al mismo tiempo, desde donde ya estás."                           |
| Tienda     | "Vende en video en vivo usando el catálogo que ya tienes, y crece con un modelo de suscripción predecible."             |
| Plataforma | "Un marketplace transaccional con ingesta de catálogo externalizada y control central de planes, usuarios y auditoría." |

**Diferenciadores técnicos:** ingesta de catálogo vía OAuth (WordPress) e instalación de app (Shopify) en lugar de carga manual; salas de video embebidas con JWT (Jitsi); notificaciones realtime vía STOMP/SockJS; cobro antifraude por RUC (Niubiz).

---

## 5. Alcance del producto

### 5.1 Módulos dentro de alcance

| Módulo                              | Árbol de rutas                       | Estado                        |
| ----------------------------------- | ------------------------------------ | ----------------------------- |
| **Marketplace público** (comprador) | `/shop/*`                            | Funcional                     |
| **Consola de tienda**               | `/stores/*`                          | Funcional con huecos          |
| **Consola de administración**       | `/admin/*`                           | Parcial (mezcla live + mocks) |
| **Autenticación y sesión**          | `/account`, `/auth/*`                | Funcional con huecos          |
| **Creador de contenido en vivo**    | integración Jitsi + creación         | Funcional                     |
| **Suscripción y pagos**             | planes, facturas, Niubiz/MP          | Funcional con huecos          |
| **Calendario y citas**              | `/stores/contact`, `create-calendar` | Funcional con hueco           |
| **Auditoría y legal**               | `action-audit`, `legal-documents`    | Funcional                     |
| **Notificaciones realtime**         | WebSocket STOMP                      | **[ROTO]**                    |

### 5.2 Fuera de alcance (no en este PRD)

- Backend/API y microservicios (consumido como servicio externo en Railway).
- Aplicación móvil nativa (solo SPA web responsive).
- Pasarelas de pago adicionales a Niubiz y MercadoPago.
- Integraciones con redes sociales para login (solo email + JWT/refresh).
- Checkout propio de la compra (Tynbiz no procesa la venta del producto: la tienda cobra en su propia pasarela).

---

## 6. Arquitectura de información y mapa de rutas

> Routing con `HashLocationStrategy` → **todas las URLs llevan `#`**: `/#/shop/home`. Redirects deben incluirlo.

### 6.1 Raíz (`src/app/app.routes.ts`)

| Ruta                 | Destino lazy                                        | Guard                 |
| -------------------- | --------------------------------------------------- | --------------------- |
| `/shop`              | `pages/shopper/shopper.routes`                      | —                     |
| `/account`           | `pages/account/account.component`                   | `isAutenticatedGuard` |
| `/confirmation`      | `pages/account/confirmation/confirmation.component` | —                     |
| `/admin`             | `pages/admin/admin.routes`                          | `isAutenticatedGuard` |
| `/stores`            | `pages/stores/stores.routes`                        | `isAutenticatedGuard` |
| `/auth/verify-email` | `shared/verification/verification`                  | —                     |
| `''` , `**`          | → `shop`                                            | —                     |

### 6.2 Comprador (`/shop`)

| Ruta                       | Componente                                                            | Guard                                  |
| -------------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| `/shop/home`               | Landing de marketed                                                   | —                                      |
| `/shop/stores`             | Catálogo de tiendas públicas con búsqueda                             | —                                      |
| `/shop/creations`          | Descubrimiento de creaciones en vivo (por categoría, keyword, ubigeo) | —                                      |
| `/shop/offer`              | Pestaña de ofertas (mismo endpoint, `type=OFERTAS`)                   | —                                      |
| `/shop/favorites`          | Tiendas favoritas                                                     | `isAutenticatedGuard`, `isClientGuard` |
| `/shop/your-creation`      | Mis salas de interacción (cuenta regresiva, entrar, eliminar)         | `isAutenticatedGuard`, `isClientGuard` |
| `/shop/profile`            | Perfil del comprador; "Solicitar Tynbiz"                              | —                                      |
| `/shop/jitsi/:idContenido` | Sala Jitsi embebida                                                   | —                                      |
| `/shop/register`           | Registro de comprador + condiciones legales                           | —                                      |
| `/shop/offer`, `''`, `**`  | fallbacks → `home`                                                    | —                                      |

### 6.3 Tienda (`/stores`)

| Ruta                      | Componente                                               | Nota                        |
| ------------------------- | -------------------------------------------------------- | --------------------------- |
| `/stores/init-store`      | Landing de tienda                                        | **[HUECO]** plantilla vacía |
| `/stores/products`        | Hub de productos: connector WordPress / Shopify + grilla | TanStack Query              |
| `/stores/contact`         | Citas (agenda) del cliente                               | —                           |
| `/stores/creation`        | Gestor de creaciones (PUBLICADOS / OFERTAS / EN_VIVO)    | —                           |
| `/stores/client`          | "Clientes en sala"                                       | **[BETA]** 100% mock        |
| `/stores/info-store`      | Logo, teléfono, dirección                                | —                           |
| `/stores/subscriptions`   | Suscripción: plan, método de pago, historial             | —                           |
| `/stores/create-creation` | Asistente de creación (2 pasos)                          | —                           |
| `/stores/create-calendar` | Configuración de calendario                              | —                           |

### 6.4 Administración (`/admin`)

| Ruta                                                           | Componente                                   | Nota                             |
| -------------------------------------------------------------- | -------------------------------------------- | -------------------------------- |
| `/admin/panel`                                                 | Dashboard KPIs                               | **[BETA]** 100% mock             |
| `/admin/list-user-admin`, `/:id`                               | Usuarios + detalle (4 pestañas)              | parcial                          |
| `/admin/list-role`, `form-new-role`                            | Roles                                        | crear rol **[HUECO]** (log only) |
| `/admin/list-store`                                            | Tiendas + cambio de estado (`PATCH /status`) | live                             |
| `/admin/planes-suscription`, `plan-suscript`                   | Planes CRUD; tiendas con plan                | parcial / mock                   |
| `/admin/revenue`, `statistic`, `payment`, `billingHistory/:id` | Reportes y pagos                             | **[BETA]** 100% mock             |
| `/admin/politic`                                               | Documentos legales (PDF)                     | live                             |
| `/admin/list-actions-user`                                     | Auditoría                                    | live                             |
| `/admin/request-demo`, `request-service`                       | Solicitudes y aprobaciones                   | live                             |

---

## 7. Requisitos funcionales

Prioridad: **P0** = crítico para operar · **P1** = importante · **P2** = deseable a futuro.

### 7.1 Autenticación y sesión

| ID        | Requisito                                                                                                                                                                                                           | Prioridad | Estado                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| RF-AUT-01 | Login con email + contraseña (`POST /auth/login`), devuelve access + refresh token + user.                                                                                                                          | P0        | Hecho                                                                                                             |
| RF-AUT-02 | Persistir `token`, `refreshToken`, `user` en `localStorage`.                                                                                                                                                        | P0        | Hecho                                                                                                             |
| RF-AUT-03 | Refresh de sesión (`POST /auth/refresh`) disparado por guard; logout ante `401` no-login (limpia storage, navega a shop, reload a 500 ms).                                                                          | P0        | Hecho                                                                                                             |
| RF-AUT-04 | Registro de comprador (`POST /auth/register-buyer`) con DNI, teléfono, fecha de nacimiento (≥18), género, contraseña segura (mayúscula, minúscula, dígito, especial, ≥8) y aceptación de términos/privacidad (PDF). | P0        | Hecho                                                                                                             |
| RF-AUT-05 | Verificación de email por token (`/auth/verify-email?token=`) con auto-login posterior.                                                                                                                             | P0        | Hecho                                                                                                             |
| RF-AUT-06 | Cambio de contraseña (perfil, pestaña Seguridad).                                                                                                                                                                   | P1        | **[HUECO]** `onSave()` sin API                                                                                    |
| RF-AUT-07 | Verificación de cuenta por código de 6 dígitos.                                                                                                                                                                     | P2        | **[HUECO]** `onSave()` sin API                                                                                    |
| RF-AUT-08 | Aplicar `isAdminGuard` a `/admin` y `isOwnerGuard` a `/stores`.                                                                                                                                                     | **P0**    | **[HUECO] BUG** — ambos guards existen pero **nunca se aplican**; `/admin` y `/stores` sólo exigen autenticación. |
| RF-AUT-09 | Incluir `SUPER-ADMIN` de forma consistente en `MenuService`/`AuthService.isAdmin()`.                                                                                                                                | P1        | **[HUECO]** el sidebar lo contempla, el servicio no                                                               |

### 7.2 Marketplace / comprador

| ID        | Requisito                                                                                                                                                                     | Prioridad | Estado                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| RF-SHP-01 | Catálogo de tiendas públicas paginado con búsqueda (`GET /public/stores`), recarga al favoritar/desfavoritar.                                                                 | P0        | Hecho                         |
| RF-SHP-02 | Marcar tienda como favorita (`POST/DELETE /me/favorite-stores/{id}`) y listar favoritas.                                                                                      | P0        | Hecho                         |
| RF-SHP-03 | Descubrimiento de creaciones en vivo con filtros: keyword, ubigeo (departamento/provincia/distrito), categoría de tienda, tipo (`ALL`/`OFERTAS`).                             | P0        | Hecho                         |
| RF-SHP-04 | Tarjeta de creación con identidad de tienda, métricas (espectadores, participantes, avatares), carrusel de productos y entrada a la sala.                                     | P0        | Hecho                         |
| RF-SHP-05 | Forzar login al intentar unirse a una sala siendo anónimo.                                                                                                                    | P0        | Hecho                         |
| RF-SHP-06 | "Tu creación": listar mis salas, cuenta regresiva en vivo, entrar a la sala, eliminar sala.                                                                                   | P0        | Hecho                         |
| RF-SHP-07 | Crear sala de interacción: visibilidad `PUBLICO`/`PRIVADO`, fecha programada o "empezar ahora", hasta 5 productos, buscar usuarios (debounce 400 ms) e invitar por WebSocket. | P0        | Hecho                         |
| RF-SHP-08 | Solicitar Tynbiz (demo) desde perfil → URL externa.                                                                                                                           | P2        | Hecho                         |
| RF-SHP-09 | Eliminar la dependencia de `creationMock` residual en la vista de ofertas.                                                                                                    | P2        | **[BETA]** mezcla mock + real |

### 7.3 Consola de tienda

| ID        | Requisito                                                                                                                                                                                                                   | Prioridad | Estado                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------- |
| RF-STO-01 | Conectar WordPress por OAuth: validar URL, `POST /integrations/wordpress/connect`, abrir `authorizationUrl` en pestaña nueva, **polling de estado cada 5,5 s**, y al `ACTIVE` disparar `POST /integrations/wordpress/sync`. | P0        | Hecho                                                     |
| RF-STO-02 | Conectar Shopify (instalar app custom en 2 pasos: abrir URL de instalación + capturar dominio `*.myshopify.com`).                                                                                                           | P1        | **[BETA]** `connect()` simulado con `Math.random() > 0.3` |
| RF-STO-03 | Grilla de productos de la tienda con TanStack Query (`staleTime` 5 min) y prefetch de la página siguiente al pasar el cursor.                                                                                               | P0        | Hecho                                                     |
| RF-STO-04 | Agregar/quitar productos de la creación (canasto local persistido en `localStorage`, máx. 5).                                                                                                                               | P0        | Hecho                                                     |
| RF-STO-05 | Asistente de creación en 2 pasos (productos → detalle: título, contenido, opción `SOLO_PUBLICACION`/`EN_VIVO`, fecha programada opcional) → `POST /contents`.                                                               | P0        | Hecho                                                     |
| RF-STO-06 | Gestionar creaciones por pestañas PUBLICADOS / OFERTAS / EN_VIVO.                                                                                                                                                           | P0        | Hecho                                                     |
| RF-STO-07 | Editar datos de tienda: logo (flujo presigned), teléfono, dirección (`PATCH /stores/me`).                                                                                                                                   | P0        | Hecho                                                     |
| RF-STO-08 | Agenda de citas (`GET /appointments`) y transiciones de estado `CONFIRMADA / RECHAZADA / COMPLETADA / FINALIZADA` con razón.                                                                                                | P0        | Hecho                                                     |
| RF-STO-09 | Configurar calendario: horario semanal (lunes–domingo, mañana/tarde), días especiales, duración de slot, tipos de servicio.                                                                                                 | P0        | Hecho                                                     |
| RF-STO-10 | Persistir la duración por tipo de servicio contra la API (`PUT /calendars/my-config`).                                                                                                                                      | P1        | **[HUECO]** sólo `localStorage['calendarAppointments']`   |
| RF-STO-11 | "Clientes en sala" con sesiones reales y filtros.                                                                                                                                                                           | P2        | **[BETA]** 100% mock                                      |
| RF-STO-12 | Landing de tienda con contenido y onboarding real.                                                                                                                                                                          | P2        | **[HUECO]** plantilla vacía                               |
| RF-STO-13 | Estado de conexión de integraciones por tienda (WordPress y Shopify) visible en el hub de productos.                                                                                                                        | P1        | Parcial (sólo WordPress)                                  |

### 7.4 Suscripción y pagos (tienda)

| ID        | Requisito                                                                                                                                             | Prioridad | Estado                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| RF-SUB-01 | Ver suscripción actual (plan, estado, fechas, precio, ciclo, auto-renovación, límites efectivos, días restantes).                                     | P0        | Hecho                                                                           |
| RF-SUB-02 | Cambiar de plan consultando elegibilidad (`GET /subscriptions/me/change-plan/eligibility`) → `PUT /subscriptions/{planId}/change-plan`.               | P0        | Hecho                                                                           |
| RF-SUB-03 | Pagar factura con **Niubiz**: `POST /niubiz/payments/session` con carga antifraude derivada del RUC/ubigeo de la tienda; redirigir a `checkoutJsUrl`. | P0        | Hecho                                                                           |
| RF-SUB-04 | Pagar factura con **MercadoPago**: `POST /mercadopago/payments` → `checkoutUrl`; guardar `paymentId` en `sessionStorage`.                             | P0        | Hecho                                                                           |
| RF-SUB-05 | Historial completo de facturas por estado (`DRAFT, SENT, PAID, OVERDUE, CANCELLED, REFUNDED`).                                                        | P0        | Hecho                                                                           |
| RF-SUB-06 | Resolver webhooks de pago / marcar factura como pagada en la UI.                                                                                      | P0        | **[HUECO]** no hay manejo de retorno (`sandboxInitPoint`/`initPoint` no usados) |
| RF-SUB-07 | Alta de suscripción vía solicitud aprobada por administración (`POST /admin/subscription-requests/{id}/approvals` → "enviar link de incorporación").  | P0        | Hecho                                                                           |

### 7.5 Administración

| ID        | Requisito                                                                                                   | Prioridad | Estado                              |
| --------- | ----------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------- |
| RF-ADM-01 | Listado y detalle de usuarios con filtros (estado, rango de fechas) y alta de usuario.                      | P0        | Hecho                               |
| RF-ADM-02 | Gestión de tiendas: búsqueda, filtro, y cambio de estado (`ACTIVE / SUSPENDED / CANCELLED`).                | P0        | Hecho                               |
| RF-ADM-03 | CRUD de planes de suscripción (nombre, precio, moneda, ciclo, promoción, descuento, días de promo, prueba). | P0        | Hecho                               |
| RF-ADM-04 | Activar/desactivar/eliminar plan de forma persistente.                                                      | P1        | **[BETA]** sólo estado local        |
| RF-ADM-05 | Auditoría de acciones de usuario (`GET /admin/action-audit/search`) con búsqueda y rango de fechas.         | P0        | Hecho                               |
| RF-ADM-06 | Gestor de documentos legales (subir/listar PDF por tipo, render embebido).                                  | P0        | Hecho                               |
| RF-ADM-07 | Solicitudes de demo: listado, detalle, alternar estado; alta pública desde el perfil del comprador.         | P0        | Hecho                               |
| RF-ADM-08 | Matriz de permisos por usuario (Editar/Eliminar/Crear/Exportar/Importar + ítems de menú).                   | P1        | **[HUECO]** sólo UI, no persiste    |
| RF-ADM-09 | Dashboard del panel con KPIs reales (usuarios, tiendas, ingresos, suscripciones, usuarios conectados).      | P1        | **[BETA]** 100% mock                |
| RF-ADM-10 | Reportes de ingresos reales por tienda y Suscripción.                                                       | P1        | **[BETA]** 100% mock                |
| RF-ADM-11 | Estadísticas reales (5 gráficas: suscripciones, registros, vistas, tiendas, general).                       | P1        | **[BETA]** 100% mock                |
| RF-ADM-12 | Gestión de métodos de pago (activar/desactivar/eliminar).                                                   | P1        | **[BETA]** 100% mock                |
| RF-ADM-13 | Listado "tiendas con planes" e historial de facturación por tienda.                                         | P1        | **[BETA]** 100% mock                |
| RF-ADM-14 | Crear rol (nombre, descripción) contra la API.                                                              | P2        | **[HUECO]** `onSave()` sólo log     |
| RF-ADM-15 | Detalle de usuario → pestaña de acciones y sesiones con datos reales.                                       | P2        | **[BETA]** filtrado de mocks por id |

### 7.6 Integraciones y plataforma

| ID        | Requisito                                                                                                                                                                         | Prioridad | Estado                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| RF-PLT-01 | Ingesta de catálogo vía OAuth de WordPress con polling y sincronización.                                                                                                          | P0        | Hecho                                                                                                                         |
| RF-PLT-02 | Ingesta de catálogo vía Shopify.                                                                                                                                                  | P1        | **[BETA]** conectar simulado                                                                                                  |
| RF-PLT-03 | Videollamada embebida con JWT (Jitsi `external_api.js`) en la ruta de creación, y apertura de sala en pestaña nueva con `code` de refresh token desde "tu creación"/notificación. | P0        | Hecho                                                                                                                         |
| RF-PLT-04 | Centro de notificaciones realtime (STOMP sobre SockJS): no leídas, marcar como leída, unirse a la sala desde la notificación.                                                     | P0        | **[ROTO]** `StoreService.tokenSubject` nunca se publica → `connectWebSocket()` retorna temprano; la campana nunca se conecta. |
| RF-PLT-05 | Subida de avatar/logo mediante URL presignada (`POST /storage/presigned-url` → `PUT` directo a Cloudflare R2 → `PUT /users/me/avatar` o `/stores/me/logo`).                       | P0        | Hecho                                                                                                                         |
| RF-PLT-06 | Confirmación global antes de todo `DELETE` (modal compartido), con opt-out por `?noConfirm`.                                                                                      | P0        | Hecho                                                                                                                         |
| RF-PLT-07 | Navegación de listas por query params de URL (página, tamaño, búsqueda, estado, fechas) — enlaces compartibles y refresco preserva filtros.                                       | P0        | Hecho                                                                                                                         |

---

## 8. Modelo de datos (entidades principales)

Entidades clave extraídas de `src/app/interfaces/**`. **Los payloads del backend son deliberadamente en español y no deben traducirse.**

### 8.1 Identidad

| Entidad                                  | Campos clave                                                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `User`                                   | `id, email, firstName, lastName, fullName, phone, role, status, storeId?, emailVerified, lastLoginAt, createdAt, avatarUrl?/photoUrl?` |
| `AuthResponse`                           | `accessToken, refreshToken, tokenType, expiresIn, user`                                                                                |
| `IUserStore` (tienda vista por su dueño) | `ruc, logo, onboardingCompleted, currency, timezone, category, categoryDisplayName, planName, planType`                                |

### 8.2 Tienda y producto

| Entidad                                           | Campos clave                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IStoresResp` / `IStore` / `ContentPublicStore`   | `id, businessName, tradeName, displayName, ruc, email, phone, storeUrl, logo, address, ubigeoId, departamento, provincia, distrito, country, fullAddress, status, onboardingCompleted, industry, currency, timezone, category, categoryDisplayName, planName, planType, createdAt, updatedAt` (+ `isFavorite, totalFavorites, website, city` en la vista pública) |
| `StoreSeachContent` (admin)                       | `displayName, storeUrl, departamento, categoryName, statusName, planType, totalSpent`                                                                                                                                                                                                                                                                             |
| Estado de tienda                                  | `SUSPENDED \| ACTIVE \| CANCELLED \| PENDING`                                                                                                                                                                                                                                                                                                                     |
| `ProductContent` / `IProduct` / `ProductoContent` | `id, storeId, storeName, name, description, sku, stock, categoryCatId, sizes[], colors[], originalPrice, discountPrice, currentPrice, discountPercentage, mediaUrls[], productUrl, isActive, featured, inStock, hasDiscount`                                                                                                                                      |
| `IProductStore` (comprador, ligera)               | `price, stock, mainImageUrl`                                                                                                                                                                                                                                                                                                                                      |

### 8.3 Creación / sala de interacción

| Entidad                                    | Campos clave                                                                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ICreateResq` (crear)                      | `title, description, publicationOption, contentDetail, visibility, startDate, endDate, status, productIds[], userIds[], observacion`                                               |
| `ICreationResp`                            | agrupa `ICreationContent[]` por `categoryName/categoryCode/totalItems`                                                                                                             |
| `ItemCreation`                             | `id, title, status, contentType, store{id,name,logoUrl,url}, metrics{viewerCount, participantCount, participantAvatars[]}, products[], scheduledInfo, videoRoomName, videoRoomUrl` |
| `ContentMyCreation` / `IIterarionRoomResp` | `creatorId/Name/AvatarUrl, visibility, scheduledAt, videoRoomName/Url/ExpiresAt, roomStatus, secondsUntilLive, invitations[], products[]`                                          |
| `ProductCreation`                          | `id, name, brand, imageUrl, mainImageUrl, originalPrice, offerPrice, discountPercentage`                                                                                           |
| Opción de publicación                      | `SOLO_PUBLICACION \| EN_VIVO`                                                                                                                                                      |

### 8.4 Suscripción, plan y factura

| Entidad                    | Campos clave                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IMeSuscriptionStore`      | `planId/code/name, status/statusDisplay, startDate, endDate, trialEndDate, nextBillingDate, currentPrice, currency, billingCycle(+Display), autoRenew, customMax*/effectiveMax* (users/products/transactions), cancellation*, daysRemaining, priceDisplay` |
| `IPlan` / `IplanRequest`   | `name, description, currency, price, billingCycle, freeTrialMonths, promotionalLabel, pricePerUse, features[], hasPromotion, discountPercentage, discountDays, maxUsers, maxStorageGb, maxProducts, maxTransactionsPerMonth, isPublic, sortOrder`          |
| `InvoicesResp`             | `invoiceNumber, storeId/Name, subscriptionId, status/statusDisplay, issueDate, dueDate, paidAt, subtotal, taxRate, taxAmount, discountAmount, totalAmount, currency, billingDetails, lineItems[], isOverdue, isPaid, daysUntilDue`                         |
| `InvoicesPayResp` (Niubiz) | `sessionKey, purchaseNumber, paymentId, merchantId, amount, checkoutJsUrl, expirationMinutes`                                                                                                                                                              |
| `IMercadoPagoResp`         | `paymentId, preferenceId, initPoint, sandboxInitPoint, checkoutUrl, publicKey, environment, purchaseNumber, expiresAt`                                                                                                                                     |
| `Antifraud` (Niubiz)       | `clientEmail, documentType(RUC), documentNumber, firstName, lastName, phoneNumber, billingAddress{street, city, state, postalCode, countryCode}`                                                                                                           |

### 8.5 Agenda

| Entidad                 | Campos clave                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ICalendar`             | `calendarId/Name, slotDurationMinutes, status, bookingWindowDays/Type, daySchedules[], dateOverrides[], allowedSlotDurations[], maxAppointmentsPerDay, effectiveMaxAppointmentsPerDay, maxAppointmentsPerMonth, maxParticipantsPerSession, videoCourtesyMinutes, planType, remainingAppointmentsThisMonth` |
| `DaySchedule`           | `id, dayOfWeek, morningStart/End, afternoonStart/End, isWorkDay`                                                                                                                                                                                                                                           |
| `DateOverride`          | `id, overrideDate, morning*/afternoon*, isDayOff, reason`                                                                                                                                                                                                                                                  |
| `ContentContact` (cita) | `calendarId/Name, storeId/Name, customerUserId/Name/Email/AvatarUrl, appointmentDate, startTime, endTime, status, notes, trackingToken, confirmedAt, cancelledAt, cancellationReason, videoRoomName/Url/ExpiresAt`                                                                                         |
| Estado de cita          | `PENDIENTE \| CONFIRMADA \| RECHAZADA \| COMPLETADA \| FINALIZADA`                                                                                                                                                                                                                                         |

### 8.6 Genéricos (patrón transversal)

- **Paginación `OptionsRequest`:** `page, size, sort, sortDirection, nombre, startDate, endDate, status, isActive, isPublic, searchTerm, ubigeoId, keyword, tab, storeCategory`.
- **`DataPaginationResponse`:** `page, size, totalElements, totalPages, first, last, hasNext, hasPrevious, numberOfElements, empty`.
- **Error RFC-7807 `IErrorGeneralResp`:** `type, title, status, detail, instance, errorCode, timestamp, validationErrors` → la UI muestra `error.error.detail`.
- **`AlertI`:** `title, message, type(success|error|info|warning), timeout, isAction`.

---

## 9. Roles, permisos y autorización

### 9.1 Roles

| Rol           | Descripción                           | Destino post-login   |
| ------------- | ------------------------------------- | -------------------- |
| `CLIENT`      | Comprador / creador social            | `/shop/home`         |
| `STORE_OWNER` | Dueño de tienda                       | `/stores/init-store` |
| `ADMIN`       | Administrador                         | `/admin/panel`       |
| `SUPER-ADMIN` | Administrador superior (sólo sidebar) | `/admin/panel`       |
| _(ninguno)_   | Anónimo                               | `/shop/home`         |

### 9.2 Reglas de autorización

| ID    | Regla                                                                                              | Estado          |
| ----- | -------------------------------------------------------------------------------------------------- | --------------- |
| RA-01 | Las rutas `/account`, `/admin`, `/stores`, `/shop/favorites`, `/shop/your-creation` exigen sesión. | Hecho           |
| RA-02 | `/admin` exige rol ADMIN.                                                                          | **[HUECO] P0**  |
| RA-03 | `/stores` exige rol STORE_OWNER.                                                                   | **[HUECO] P0**  |
| RA-04 | El menú lateral y los CTAs se ocultan por rol (`MenuService.createMenuForRole`).                   | Hecho (sólo UI) |
| RA-05 | Los permisos por usuario (matriz de la consola admin) se persisten y se aplican en backend/UI.     | **[HUECO]**     |
| RA-06 | El backend es la fuente de verdad de autorización (el cliente no debe ser la única barrera).       | Backend         |

> **Nota de seguridad (P0):** la autorización real debe residir en el backend. La ausencia de `isAdminGuard`/`isOwnerGuard` es un defecto de UX/seguridad de cliente que debe corregirse, pero no sustituye la validación del servidor.

---

## 10. Requisitos no funcionales

| ID     | Categoría              | Requisito                                                                                                                                                                                                                                                         | Estado                            |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| RNF-01 | Build                  | `npm run build:prod` debe compilar TS + plantillas sin errores (`strictTemplates`). Presupuesto inicial: warning 1.5 MB / error 2 MB; `anyComponentStyle`: warning 4 kB / error 8 kB.                                                                             | Cumple                            |
| RNF-02 | Verificación           | **No existe linter, typecheck, formateo ni e2e.** La verificación real es el build de producción.                                                                                                                                                                 | Brecha                            |
| RNF-03 | Tests                  | `npm test` no es una puerta válida (spec scaffold roto, sin `karma.conf.js`, Chrome no-headless).                                                                                                                                                                 | Brecha                            |
| RNF-04 | CI                     | Push a `main` → build de producción → despliegue a GitHub Pages (`gh-pages`) con Node 24.19.0. Sin staging, sin preview, sin puerta de calidad.                                                                                                                   | Parcial                           |
| RNF-05 | Entornos               | Variables de URL **hardcodeadas** en `src/environments/*.ts`; ambos archivos apuntan a producción. Sin carga por variables de entorno.                                                                                                                            | Brecha                            |
| RNF-06 | Seguridad              | Interceptores en orden: (1) `isLoginInterceptor` (401 → logout+reload), (2) `authInterceptor` (Bearer, exento R2), (3) `confirmDeleteInterceptor` (todo DELETE pide confirmación).                                                                                | Cumple                            |
| RNF-07 | Responsive             | Sidebar de escritorio + barra inferior en móvil (Inicio / Para ti / Ofertas / Tiendas / Perfil).                                                                                                                                                                  | Cumple                            |
| RNF-08 | Accesibilidad          | Sidebar de consola con `MutationObserver` que ajusta el foco de enlaces; foco visible en botones.                                                                                                                                                                 | Parcial                           |
| RNF-09 | Rendimiento            | TanStack Query en productos (`staleTime` 5 min + prefetch); `outputHashing: all`. Presupuesto de estilos 8 kB/componente.                                                                                                                                         | Parcial (1 de N servicios)        |
| RNF-10 | Estado global          | `StoreService` como store manual (`BehaviorSubject`/`EventEmitter`) + signals en `AuthService`/`AlertService`. Preferencia: extender `StoreService`.                                                                                                              | Cumple                            |
| RNF-11 | Idiomas                | Interfaz y validaciones **en español**; payloads del backend en español (no traducir). Variables/archivos de dominio mayoritariamente en inglés.                                                                                                                  | Cumple                            |
| RNF-12 | Geolocalización        | Cascada ubigeo peruana (departamento → provincia → distrito) para filtros y facturación.                                                                                                                                                                          | Cumple                            |
| RNF-13 | Formato de moneda      | Soles Slaughter (`S/. 1 234.56`) vía pipe `soles`.                                                                                                                                                                                                                | Cumple                            |
| RNF-14 | Convenciones de código | Standalone, prefijo selector `tyn-`, `ChangeDetectionStrategy.Eager` (nunca `OnPush`), rutas lazy con `export default`, servicios nuevos en `src/app/services/index.ts`, importar `@environments/environment` (no `.development`), 2 espacios y comillas simples. | Cumple (documentado en AGENTS.md) |

---

## 11. Integraciones

| Integración                                     | Uso                                                                                                                                   | Estado                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Jitsi Meet** (self-hosted `jitsi.tynbiz.com`) | Videollamada embebida (`external_api.js` + JWT de `/jitsi/token/{idContenido}`) y apertura de sala en pestaña (`?code=refreshToken`). | Funcional                                          |
| **WordPress**                                   | OAuth de catálogo + polling 5,5 s + sync. Integración de referencia.                                                                  | Funcional                                          |
| **Shopify**                                     | Instalación de app custom (URL pre-firmada) + dominio `*.myshopify.com`.                                                              | **[BETA]** conectar simulado                       |
| **Cloudflare R2**                               | Subida presignada de avatar/logo (clave de entorno mal nombrada `CLOUDINARY_URL`).                                                    | Funcional                                          |
| **Niubiz**                                      | Checkout de facturas con carga antifraude (RUC).                                                                                      | Funcional                                          |
| **MercadoPago**                                 | Checkout por preferencia de pago.                                                                                                     | Funcional (sin retorno/validación)                 |
| **STOMP / SockJS**                              | Notificaciones realtime por WebSocket (`/ws-notifications` → `/user/queue/notifications`).                                            | **[ROTO]** token nunca publicado                   |
| **Flowbite 4**                                  | Drawers, carruseles, tabs, collapse. `initFlowbite()` una vez en `AppComponent`.                                                      | Funcional (widgets por ruta pueden quedar inertes) |
| **Chart.js**                                    | Gráficas de estadísticas/reportes.                                                                                                    | Funcional (datos mock)                             |
| **ng2-pdf-viewer**                              | Documentos legales (términos/privacidad) y vista previa de PDFs.                                                                      | Funcional                                          |
| **FontAwesome 7**                               | Iconografía (clases `fa-solid fa-*` + SVG inline).                                                                                    | Funcional                                          |
| **socket.io-client**                            | Dependencia instalada sin uso.                                                                                                        | **[ROTO]** eliminar                                |

---

## 12. Sistema de diseño (UI/UX)

### 12.1 Lenguaje visual

Marca índigo/violeta ("morado") sobre base **crema** (`#faf8f2`) para la superficie pública, con fondo degradado animado (dos capas `fixed`, `mix-blend-multiply`, `blur`) — `.side-init`. Las consolas admin y tienda usan gris plano (`.side-secondary`) para un aspecto utilitario.

### 12.2 Tokens (`@theme` en `src/styles.css`, sin `tailwind.config.js`)

| Token                            | Valor                    |
| -------------------------------- | ------------------------ |
| `--color-primary`                | `#5e63b6`                |
| `--color-primary-light`          | `#edeeff`                |
| `--color-primary-dark`           | `#28184e`                |
| `--color-secondary`              | `#dedeff`                |
| `--color-secondary-dark`         | `#bcbedf`                |
| `--font-heading` / `--font-body` | `Lato`                   |
| `--spacing-8xl`                  | `90rem`                  |
| `--text-2xs`                     | `0.625rem`               |
| `--animate-fadeIn`               | `fadeIn .5s ease-in-out` |

### 12.3 Clases de componentes reutilizables (usar en lugar de re-estilar)

`.button-primary` · `.button-secondary` · `.button-disabled` · `.input-base` · `.input-error` · `.card` · `.card-static` / `.card-store` · `.card-presentation` · `.mini-card-img` (`.md/.sm/.xs`) · `.body-tbz` (comprador) · `.body-primary` / `.body-secondary` (consolas) · `.tab` / `.tab-active` / `.tab-inactive` · `.tabla` (tablas) · `.content-details-product` · `.side-init` / `.side-secondary`.

### 12.4 Componentes compartidos

`alert` · `pagination` · `filter` · `search` (keyword + categoría + cascada ubigeo) · `title` · `stores-card` · `product-detail-card` · `creation-card` · `carousel-products-creation` · `chart-grafic` · `simple-card` · `info-card` · `condition-modal` · `pdfupload` · `warning-modal` · `success-modal` · `change-password` · `verific-account` · `create-user-form` · `jitsi`.

Shell de la app: `side-menu` (3 ramas por rol + barra inferior móvil + modales globales) y `navbar` (campana de notificaciones, menú de usuario).

### 12.5 Patrones de interacción

- **Paginación y filtros viven en la URL** (`LinkParamService` + `pagination` + `filter`): los enlaces son compartibles y sobreviven al refresco.
- **Validación** en `src/app/utils/form.util.ts`: mensajes en español, `FormUtils.isValiedField()` (sic) y `getFieldError()`.
- **Confirmación** en todo `DELETE` mediante modal global; opt-out con `?noConfirm`.
- **Alertas** globales tipo toast con redirección opcional.

---

## 13. Casos de uso principales

### CU-01 — Comprador descubre y participa en una creación

1. Anónimo navega `/#/shop/creations` (filtros por keyword, categoría y ubigeo).
2. Selecciona una creación en vivo; la tarjeta muestra tienda, espectadores y productos.
3. Al pulsar "unirse", si es anónimo se le pide login.
4. Autenticado, se abre `/#/shop/jitsi/:idContenido` → Jitsi embebido con JWT.
5. En la sala ve el catálogo y conversa con el vendedor y otros compradores.

### CU-02 — Dueño de tienda publica una creación en vivo

1. `/#/stores/products` — si no hay integración, conecta WordPress (OAuth + polling) o Shopify.
2. Sincroniza y navega el catálogo (prefetch al pasar de página).
3. `/stores/create-creation` — Paso 1: elige hasta 5 productos (canasto en `localStorage`).
4. Paso 2: título, contenido, opción `EN_VIVO`, fecha programada o inmediata.
5. `/stores/creation` → pestaña EN_VIVO para monitorear.
6. Invita compradores desde la creación o recibe notificaciones en tiempo real (bell).

### CU-03 — Dueño de tienda gestiona su suscripción

1. `/stores/subscriptions` → pestaña planes: ve su suscripción actual y días restantes.
2. Solicita cambio de plan (valida elegibilidad en backend).
3. Pestaña método de pago: paga la factura con Niubiz o MercadoPago.
4. Pestaña historial: consulta todas sus facturas y estados.

### CU-04 — Administrador suspende una tienda

1. `/admin/list-store` — busca y filtra tiendas.
2. En la fila, cambia el estado a `SUSPENDED` (`PATCH /stores/{id}/status`).
3. La tienda deja de operar; queda trazabilidad en auditoría.

### CU-05 — Comprador solicita una demo

1. `/shop/profile` → "Solicitar Tynbiz" (o alta pública de demo request).
2. Admin la revisa en `/admin/request-demo`, abre el detalle y alterna su estado (p. ej. `ATENDIDO`).

---

## 14. Métricas y analítica de producto

Objetivo: sustituir los datos mock por métricas reales y añadir tracking.

| ID    | Métrica                             | Definición                                           | Estado                             |
| ----- | ----------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| ME-01 | Tiendas activas                     | `status = ACTIVE`.                                   | mock                               |
| ME-02 | Suscripciones activas               | `status` vigente por ciclo de cobro.                 | mock                               |
| ME-03 | Ingresos (MRR / total)              | Suma de facturas `PAID` por tienda y período.        | mock                               |
| ME-04 | Creaciones publicadas / en vivo     | Conteo por tienda y período.                         | parcial                            |
| ME-05 | Espectadores y participantes        | `viewerCount` / `participantCount` de cada creación. | Hecho (dato existente, sin rollup) |
| ME-06 | Nuevos registros                    | Altas por día (gráfica de registros).                | mock                               |
| ME-07 | Tasa de conversión creación → venta | Ventas atribuidas a la sala.                         | **[HUECO]**                        |
| ME-08 | Solicitudes de demo/servicio        | Volumen y conversión a suscripción.                  | Hecho (conteo)                     |
| ME-09 | Uso de integraciones                | Tiendas con WordPress / Shopify conectados y estado. | parcial                            |
| ME-10 | Conexiones activas                  | Usuarios conectados en tiempo real.                  | mock                               |

---

## 15. Roadmap priorizado

### P0 — Bloqueantes / defectos de producción

| #   | Ítem                                                                                                                                                        | Ref.      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | Aplicar `isAdminGuard` a `/admin` y `isOwnerGuard` a `/stores`.                                                                                             | RF-AUT-08 |
| 2   | **Arreglar WebSocket**: publicar el token en `StoreService.tokenSubject` (o leerlo de `AuthService`) para que la campana de notificaciones funcione.        | RF-PLT-04 |
| 3   | **Importar siempre `@environments/environment`** en los 10 archivos que hoy importan `environment.development` (producción envía el archivo de desarrollo). | RNF-05    |
| 4   | Corregir `notImage` pipe (lógica comentada; no hace fallback de imagen).                                                                                    | —         |
| 5   | Corregir `ProductoService` (`getPersona` mal nombrado; `POST /products{id}` con slash faltante y verbo incorrecto).                                         | —         |
| 6   | Mover `ContactService` de `@Service()` a `@Injectable({providedIn:'root'})`.                                                                                | —         |
| 7   | Quitar `providers: [AuthService]` del componente de login (crea una instancia paralela de autenticación).                                                   | —         |
| 8   | Corregir `GET /products?wordpress=connected` sin `baseUrl`.                                                                                                 | —         |

### P1 — Cerrar la funcionalidad parcial y conectar datos reales

| #   | Ítem                                                                                                                          | Ref.              |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 9   | Dashboard, ingresos, estadísticas y métodos de pago del admin contra API real (dejar mocks sólo como fallback de desarrollo). | RF-ADM-09…13      |
| 10  | Shopify: `connect()` real (`POST /integrations/shopify/connect`) + estado.                                                    | RF-STO-02         |
| 11  | Matriz de permisos de usuario persistente y aplicada.                                                                         | RF-ADM-08 / RA-05 |
| 12  | Cambiar/eliminar plan de forma persistente.                                                                                   | RF-ADM-04         |
| 13  | Manejo de retorno de pago (Niubiz / MercadoPago) y marcar factura pagada.                                                     | RF-SUB-06         |
| 14  | Persistir duración por tipo de servicio contra `PUT /calendars/my-config`.                                                    | RF-STO-10         |
| 15  | Landing de tienda con onboarding real.                                                                                        | RF-STO-12         |
| 16  | Cambiar contraseña y verificación de cuenta contra API.                                                                       | RF-AUT-06/07      |
| 17  | Pipeline de verificación real (lint + typecheck + unit tests headless) y puerta en CI antes de `main`.                        | RNF-02/03/04      |
| 18  | Entornos por variables de entorno (build distinto para dev/staging/prod) + staging en GitHub Pages.                           | RNF-04/05         |
| 19  | Migrar `HttpClient.subscribe()` a TanStack Query de forma incremental (empezando por listas de administración).               | RNF-09            |
| 20  | Eliminar mocks y dependencias muertas (`socket.io-client`, `@source flowbite-datepicker`, `JITSI_ROOM_URL`, `.table {}`).     | —                 |

### P2 — Mejoras de producto

| #   | Ítem                                                                | Ref.                  |
| --- | ------------------------------------------------------------------- | --------------------- |
| 21  | Crear rol contra API.                                               | RF-ADM-14             |
| 22  | "Clientes en sala" y detalle de acciones/sesiones con datos reales. | RF-STO-11 / RF-ADM-15 |
| 23  | Métricas de conversión creación → venta y tracking de eventos.      | ME-07                 |
| 24  | Eliminar `creationMock` de la vista de ofertas.                     | RF-SHP-09             |
| 25  | Consolidar roles (`SUPER-ADMIN`) y superusuario en backend.         | RF-AUT-09             |

---

## 16. Criterios de aceptación y Definition of Done

- Una funcionalidad está **terminada** cuando:
  1. `npm run build:prod` compila sin errores (TS estricto + `strictTemplates`).
  2. Añadida al barrel de servicios si es un servicio nuevo (`src/app/services/index.ts`).
  3. Usa las clases de `styles.css` (`.button-primary`, `.tabla`, etc.) en lugar de estilos ad-hoc.
  4. Validaciones con `FormUtils` y mensajes en español.
  5. Listas nuevas siguen el patrón de filtros/paginación por query params (`LinkParamService`).
  6. Todo `DELETE` usa la confirmación global (o `?noConfirm` a propósito).
  7. Estados de carga, vacío y error implementados (`AlertService` para errores, leyendo `error.error.detail`).
  8. Responsive (escritorio + barra inferior en móvil).
- **Antes de mergear a `main`**: revisión de código. Recordar que **cualquier merge a `main` publica a GitHub Pages**.

---

## 17. Riesgos

| Riesgo                                                                      | Impacto          | Mitigación                                                                                  |
| --------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| Sin staging ni puerta de calidad; `main` publica directo.                   | Alto             | Pull requests + build de verificación + staging en Pages.                                   |
| Autorización sólo en cliente (`/admin`, `/stores` abiertos a autenticados). | Alto (seguridad) | Aplicar guards (P0-1) y validar en backend.                                                 |
| WebSocket de notificaciones roto (campana inactiva).                        | Medio            | P0-2 (publicar token en `tokenSubject`).                                                    |
| URLs de entorno hardcodeadas a producción; dev apunta a prod.               | Medio            | Variables de entorno por build (P1-18); dejar de importar `environment.development` (P0-3). |
| Gran parte del panel admin en mocks → decisiones con datos falsos.          | Medio            | Conectar API (P1-9); marcar claramente datos mock en UI de desarrollo.                      |
| Shopify "conectado" con `Math.random()`.                                    | Medio            | Implementar connect real (P1-10).                                                           |
| Coste de Jitsi self-hosted y del hosting (Railway + GitHub Pages).          | Operativo        | Monitorear uso de salas y streaming.                                                        |
| Datos de Perú localizados (DNI, RUC, ubigeo) limitan la expansión.          | Estratégico      | Considerar abstracción de país para otros mercados.                                         |
| Un solo cliente (Railway) sin CDN.                                          | Operativo        | Monitorear latencia y añadir CDN si el tráfico lo exige.                                    |

---

## 18. Supuestos y dependencias

- El **backend** (API REST + WebSocket) es un servicio externo (Railway) ya operativo; este PRD cubre el frontend/SPA.
- Jitsi, Cloudflare R2, Niubiz, MercadoPago, Shopify y WordPress son servicios de terceros con cuentas y credenciales gestionadas fuera del repositorio.
- La compra del producto la completa la tienda en su propia pasarela; Tynbiz cobra la **suscripción SaaS** de la tienda, no el producto.
- Los payloads del backend (español) son un contrato estable; cualquier cambio requiere coordinación con el equipo backend.
- Los identificadores de dominio (`idContenido`, `usuario/registrar`, `mornDesde`, `daySchedules`) se conservan tal cual.

---

## 19. Glosario

| Término                 | Significado                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Creación**            | Unidad de contenido de Tynbiz: un conjunto curado de productos (`≤5`) presentado en una sala o publicación (`SOLO_PUBLICACION` o `EN_VIVO`). |
| **Sala de interacción** | Videollamada Jitsi asociada a una creación (`interaction-rooms`), con visibilidad pública o privada e invitados.                             |
| **Tienda**              | Negocio registrado (`STORE_OWNER`) con su catálogo conectado a WordPress/Shopify.                                                            |
| **Plan**                | Paquete de suscripción SaaS (precio, ciclo, límites, prueba, promoción) que compra una tienda.                                               |
| **Factura**             | Cobro pendiente/emitido de la suscripción de una tienda (`InvoicesResp`).                                                                    |
| **Cita**                | Appointment de agenda entre cliente y tienda, con estado y Optionally video (`appointments`).                                                |
| **Creador / `CLIENT`**  | Comprador y anfitrión de creaciones.                                                                                                         |
| **Admin**               | Operador de la plataforma.                                                                                                                   |

---

## 20. Glosario técnico (referencia rápida)

- **Framework:** Angular 22.1, standalone, sin NgModules, routing por `HashLocationStrategy`.
- **Lenguaje:** TypeScript ~6.0.3, `strict`, `strictTemplates`.
- **Estilos:** Tailwind 4.3 (sin `tailwind.config.js`; tokens en `@theme`), Flowbite 4, FontAwesome 7.
- **Datos servidor:** TanStack Query (experimental, hoy 1 servicio) + `HttpClient`/RxJS.
- **Realtime:** STOMP sobre SockJS (Jitsi notifications).
- **Video:** Jitsi Meet self-hosted (embed + JWT + popup).
- **Pagos:** Niubiz y MercadoPago.
- **Almacenamiento:** Cloudflare R2 (presigned upload).
- **Build:** `@angular-devkit/build-angular:application`; `defaultConfiguration = production`.
- **CI/CD:** GitHub Actions → Node 24.19.0 → `npm ci` → `npm run build:prod` → GitHub Pages (`gh-pages`, `dist/browser`, base `/tynbiz-general-app/`).

---

_Documento generado a partir del análisis del código fuente. Para convenciones de desarrollo ver `AGENTS.md` (más preciso que `README.md` y `.cursor/rules`, que están desactualizados)._
