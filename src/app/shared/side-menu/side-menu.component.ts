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
    { name: 'Inicio', icon: 'fa-solid fa-house', route: '/shop/home' },
    { name: 'Ofertas', icon: 'fa-solid fa-tags', route: '/shop/offer' },
    {
      name: 'Creaciones',
      icon: 'fa-solid fa-square-plus',
      route: '/shop/creations',
    },
    { name: 'Tiendas', icon: 'fa-solid fa-store', route: '/shop/stores' },
    {
      name: 'Favoritos',
      icon: 'fa-solid fa-heart-circle-plus',
      route: '/shop/favorites',
    },
    {
      name: 'Tu creación',
      icon: 'fa-solid fa-boxes-packing', //
      route: '/shop/contact',
    },
  ];

  menuItemsCliente = [
    { name: 'Inicio', icon: 'fa-solid fa-house', route: '/shop/home' },
    { name: 'Productos', icon: 'fa-solid fa-tags', route: '/shop/offer' },
    {
      name: 'Contactos',
      icon: 'fa-solid fa-square-plus',
      route: '/shop/creations',
    },
    { name: 'Creaciones', icon: 'fa-solid fa-store', route: '/shop/stores' },
    {
      name: 'Clientes en sala',
      icon: 'fa-solid fa-heart-circle-plus',
      route: '/shop/favorites',
    },
    {
      name: 'Inf. de tienda',
      icon: 'fa-solid fa-boxes-packing',
      route: '/shop/contact',
    },
    {
      name: 'Suscripciones',
      icon: 'fa-solid fa-boxes-packing',
      route: '/shop/contact',
    },
  ];
}
