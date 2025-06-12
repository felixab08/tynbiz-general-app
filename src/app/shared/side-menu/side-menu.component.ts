import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-side-menu',
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  menuItems = [
    {
      id: '11asybvas',
      name: 'Inicio',
      icon: 'fa-solid fa-house',
      route: '/shop/home',
    },
    {
      id: '12bsybvas',
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
      id: '14dsybvas',
      name: 'Tiendas',
      icon: 'fa-solid fa-store',
      route: '/shop/stores',
    },
    {
      id: '14dsybvas',
      name: 'Favoritos',
      icon: 'fa-solid fa-heart-circle-plus',
      route: '/shop/favorites',
    },
    {
      id: '15esybvas',
      name: 'Tu creación',
      icon: 'fa-solid fa-boxes-packing', //
      route: '/shop/contact',
    },
  ];

  menuItemsCliente = [
    {
      id: '21asybvas',
      name: 'Inicio',
      icon: 'fa-solid fa-house',
      route: '/shop/home',
    },
    {
      id: '22bsybvas',
      name: 'Productos',
      icon: 'fa-solid fa-tags',
      route: '/shop/offer',
    },
    {
      id: '23csybvas',
      name: 'Contactos',
      icon: 'fa-solid fa-square-plus',
      route: '/shop/creations',
    },
    {
      id: '24dsybvas',
      name: 'Creaciones',
      icon: 'fa-solid fa-store',
      route: '/shop/stores',
    },
    {
      id: '25hgsybvas',
      name: 'Clientes en sala',
      icon: 'fa-solid fa-heart-circle-plus',
      route: '/shop/favorites',
    },
    {
      id: '26gsybvas',
      name: 'Inf. de tienda',
      icon: 'fa-solid fa-boxes-packing',
      route: '/shop/contact',
    },
    {
      id: '27ysybvas',
      name: 'Suscripciones',
      icon: 'fa-solid fa-boxes-packing',
      route: '/shop/contact',
    },
  ];
  menuAdmin: any = [
    {
      id: '35asbaasvas',
      name: 'Panel',
      icon: 'fa-solid fa-store',
      route: '/admin/panel',
    },
    {
      id: '31asbvas',
      name: 'Cargas',
      icon: 'fa-solid fa-house',
      route: '',
      children: [{ name: 'Politicas', route: '/admin/politic' }],
    },
    {
      id: '32bsbv1s',
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
  ];
}
