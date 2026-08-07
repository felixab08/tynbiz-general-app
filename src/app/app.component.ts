import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  imports: [SideMenuComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tynbiz-general-app';

  ngOnInit(): void {
    initFlowbite();
  }
}
