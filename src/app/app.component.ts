import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { StoreService } from './services';
import { User } from './auth/interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [SideMenuComponent, CommonModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tynbiz-general-app';
  storeService = inject(StoreService);
  public userRole = 'VISIT';

  ngOnInit(): void {
    initFlowbite();
    this.storeService.user.subscribe((user) => {
      if (user) this.userRole = user!.role;
    });
  }
}
