export const plan = [
  {
    id: 1,
    planName: 'Uso de Tynbz',
    planState: 'inactivo',
    planCoin: 'USD',
    planPrice: '0.30',
    planType: 'uso de tynbiz',
    promotional: 'false',
    promDuration: null,
    percentage: null,
    planDescription: 'Plan de uso de Tynbz para tiendas',
    planDate: '2023-10-01',
    planFeatures: [
      'Acceso a la plataforma',
      'Soporte técnico',
      'Actualizaciones regulares',
      'Integración con sistemas de pago',
    ],
  },
  {
    id: 2,
    planName: 'Plan mensual',
    planState: 'activo',
    planCoin: 'USD',
    planPrice: '10.00',
    planType: 'mensual',
    promotional: 'true',
    promDuration: '15',
    percentage: '10',
    planDescription: 'Plan básico para pequeñas tiendas',
    planDate: '2023-10-01',
    planFeatures: [
      'Acceso a la plataforma',
      'Soporte técnico básico',
      'Actualizaciones mensuales',
      'Integración con sistemas de pago básicos',
    ],
  },
  {
    id: 3,
    planName: 'Plan Anual',
    planState: 'activo',
    planCoin: 'USD',
    planPrice: '20.00',
    planType: 'anual',
    promotional: 'true',
    promDuration: '15',
    percentage: '10',
    planDescription: 'Plan avanzado para tiendas medianas y grandes',
    planDate: '2023-10-01',
    planFeatures: [
      'Acceso completo a la plataforma',
      'Soporte técnico prioritario',
      'Actualizaciones semanales',
      'Integración con múltiples sistemas de pago',
      'Herramientas de marketing avanzadas',
    ],
  },
];
export const storePlan =[
  {
    id: 1,
    storeName: 'Linio',
    storeLogo: './assets/img/log-5.png',
    storeSite: 'www.linio.com',
    costePlan:'50',
    metodPay: 'Paypal',
    planSubscription: 'Mensual',
    starPlan: '2023-10-01',
    endPlan: '2024-04-01',
    billingHistory: [
      {
        id:1,
        planSubscription: 'Mensual',
        startDate: '2023-10-01',
        endDate: '2023-11-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pagado'
      },
      {
        id:2,
        planSubscription: 'Mensual',
        startDate: '2023-11-01',
        endDate: '2023-12-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      {
        id:3,
        planSubscription: 'Mensual',
        startDate: '2023-12-01',
        endDate: '2024-01-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      {
        id:4,
        planSubscription: 'Mensual',
        startDate: '2024-01-01',
        endDate: '2024-02-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      {
        id:5,
        planSubscription: 'Mensual',
        startDate: '2024-02-01',
        endDate: '2024-03-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      {id:6,
        planSubscription: 'Mensual',
        startDate: '2024-03-01',
        endDate: '2024-04-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      // más periodos
    ]

  },
  {
    id: 2,
    storeName: 'MercadoLibre',
    storeLogo: './assets/img/log-1.png',
    storeSite: 'www.mercadolibre.com',
    costePlan:'240',
    metodPay: 'Paypal',
    planSubscription: 'Mensual',
    starPlan: '2023-10-01',
    endPlan: '2024-10-01',
     billingHistory: [
      {
        id:1,
        planSubscription: 'Anual',
        startDate: '2023-10-01',
        endDate: '2024-10-01',
        methodPayment: 'Tarjeta',
        cost: 240,
        state: 'Pagado'
      },
      {
        id:2,
        planSubscription: 'Anual',
        startDate: '2023-10-01',
        endDate: '2024-10-01',
        methodPayment: 'Tarjeta',
        cost: 240,
        state: 'Pagado'
      },
    ]
  },
  {
    id: 3,
     storeName: 'Amazon',
    storeLogo: './assets/img/log-6.jpg',
    storeSite: 'www.amazon.com',
    costePlan:'240',
    metodPay: 'Tarjeta',
    planSubscription: 'Anual',
    starPlan: '2023-10-01',
    endPlan: '2024-10-01',
    billingHistory: [
      {
        id:1,
        planSubscription: 'Mensual',
        startDate: '2023-10-01',
        endDate: '2023-11-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pagado'
      },
      {
        id:2,
        planSubscription: 'Mensual',
        startDate: '2023-11-01',
        endDate: '2023-12-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      // más periodos
    ]
  },
  {
    id: 4,
    storeName: 'Falabella',
    storeLogo: './assets/img/log-4.jpg',
    storeSite: 'www.falabella.com',
    costePlan:'50',
    metodPay: 'Tarjeta',
    planSubscription: 'Mensual',
    starPlan: '2023-10-01',
    endPlan: '2024-10-01',
    billingHistory: [
     {
        id:1,
        planSubscription: 'Mensual',
        startDate: '2023-10-01',
        endDate: '2023-11-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pagado'
      },
      {
        id:2,
        planSubscription: 'Mensual',
        startDate: '2023-11-01',
        endDate: '2023-12-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      // más periodos
    ]
  },
  {
    id: 5,
    storeName: 'Ripley',
    storeLogo: './assets/img/log-3.png',
    storeSite: 'www.ripley.com',
    costePlan:'00',
    metodPay: 'Tarjeta',
    planSubscription: 'Uso x Tynbiz',
    starPlan: '2023-10-01',
    endPlan: '2024-10-01',
    billingHistory: [
      {
        id:1,
        planSubscription: 'Mensual',
        startDate: '2023-10-01',
        endDate: '2023-11-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pagado'
      },
      {
        id:2,
        planSubscription: 'Mensual',
        startDate: '2023-11-01',
        endDate: '2023-12-01',
        methodPayment: 'Paypal',
        cost: 50,
        state: 'Pendiente'
      },
      // más periodos
    ]
  }
];

