export const menuItemsMock = [
  {
    id: '11asybvccas',
    name: 'Inicio',
    icon: 'fa-solid fa-house',
    route: '/shop/home',
  },
  {
    id: '12bsybaas',
    name: 'Ofertas',
    icon: 'fa-solid fa-tags',
    route: '/shop/offer',
  },
  {
    id: '13csybvas',
    name: 'Creaciones',
    icon: 'fa-solid fa-square-plus',
    route: '/shop/creations',
  },
  {
    id: '14dsybvas12312',
    name: 'Tiendas',
    icon: 'fa-solid fa-store',
    route: '/shop/stores',
  },
  {
    id: '14dsybvvvasas',
    name: 'Favoritos',
    icon: 'fa-solid fa-heart-circle-plus',
    route: '/shop/favorites',
    role: 'moderator',
  },
  {
    id: '15esy1212bvas',
    name: 'Tu creación',
    icon: 'fa-solid fa-boxes-packing', //
    route: '/shop/contact',
    role: 'moderator',
  },
];

export const menuItemsClienteMock = [
  {
    id: '21asybvas',
    name: 'Inicio',
    icon: 'fa-solid fa-house',
    route: '/stores/init-store',
  },
  {
    id: '22bsy121bvas',
    name: 'Productos',
    icon: 'fa-solid fa-tags',
    route: '/stores/products',
  },
  {
    id: '23csybvas',
    name: 'Contactos',
    icon: 'fa-solid fa-square-plus',
    route: '/stores/contact',
  },
  {
    id: '24dsybvas',
    name: 'Creaciones',
    icon: 'fa-solid fa-store',
    route: '/stores/creation',
  },
  {
    id: '25hgsybvas',
    name: 'Clientes en sala',
    icon: 'fa-solid fa-heart-circle-plus',
    route: '/stores/client',
  },
  {
    id: '26gsybavas',
    name: 'Inf. de tienda',
    icon: 'fa-solid fa-boxes-packing',
    route: '/stores/info-store',
  },
  {
    id: '27ysybvas',
    name: 'Suscripciones',
    icon: 'fa-solid fa-boxes-packing',
    route: '/stores/subscriptions',
  },
];
export const menuAdminMock: any = [
  {
    id: '35asbacasvas',
    name: 'Panel',
    icon: 'fa-solid fa-store',
    route: '/admin',
  },
  {
    id: '31asbvas',
    name: 'Cargas',
    icon: 'fa-solid fa-house',
    route: '',
    children: [{ name: 'Politicas', route: '/admin/politic' }],
  },
  {
    id: '32b1sbv1s',
    name: 'Solicitudes',
    icon: 'fa-solid fa-house',
    route: '',
    children: [
      { name: 'Demo', route: '/admin/request-demo' },
      { name: 'Servicios', route: '/admin/request-service' },
    ],
  },
  {
    id: '34sybvas',
    name: 'Planes',
    icon: 'fa-solid fa-tags',
    route: '',
    children: [
      { name: 'Planes de suscripción', route: '/admin/planes-suscription' },
      { name: 'Tiendas con planes', route: '/admin/plan-suscript' },
    ],
  },
  {
    id: '1234asaa1',
    name: 'Tiendas',
    icon: 'fa-solid fa-store',
    route: '/admin/list-store',
  },
  {
    id: '31234ddas1',
    name: 'Ingresos',
    icon: 'fa-solid fa-money-bill',
    route: '/admin/revenue',
  },
  {
    id: '312343dd2',
    name: 'Estadisticas',
    icon: 'fa-solid fa-chart-line',
    route: '/admin/statistic',
  },
  {
    id: '312324dd3',
    name: 'Pagos',
    icon: 'fa-solid fa-money-bill',
    route: '/admin/payment',
  },
  {
    id: '35syasqs',
    name: 'User Admin',
    icon: 'fa-solid fa-tags',
    route: '',
    children: [
      { name: 'Lista de usuarios', route: '/admin/list-user-admin' },
      { name: 'Registro de acciones', route: '/admin/list-actions-user' },
      { name: 'Lista de roles', route: '/admin/list-role' },
    ],
  },
];
