import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { initFlowbite } from 'flowbite';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  imports: [SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tynbiz-general-app';

  ngOnInit(): void {
    initFlowbite();
  }
}
