import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { StoreService } from './services';
import { User } from './auth/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { IConfirmDelete } from './auth/interfaces/confirDelete.interface';
import { ModalComponent } from './shared/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [SideMenuComponent, CommonModule, ModalComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tynbiz-general-app';
  storeService = inject(StoreService);
  public userRole = 'VISIT';
  public _storeService = inject(StoreService);
  isOpen: boolean = false;
  isModalConfirm: boolean = true;

  @ViewChild('modalRef') modalRef!: ElementRef;

  constructor() {
    // Listen modal open/close and act accordingly
    this._storeService.isModalConfirm$.subscribe((isModalConfirm) => {
      this.isModalConfirm = isModalConfirm;
      console.log(isModalConfirm);

      this.isOpen = isModalConfirm;
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.storeService.user.subscribe((user) => {
      if (user) this.userRole = user!.role;
    });
  }

  onDialogClick(event: Event) {
    const dialogEl = this.modalRef?.nativeElement as
      | HTMLDialogElement
      | undefined;
    if (!dialogEl) return;
    if (event.target === dialogEl) {
      this.closeDialog();
    }
  }

  confirm() {
    let answerConfirm: IConfirmDelete = {
      answered: true,
      response: true,
    };
    this._storeService.responseModalConfirmSubject.next(answerConfirm);
  }

  closeDialog() {
    let answerConfirm: IConfirmDelete = {
      answered: true,
      response: false,
    };
    this._storeService.responseModalConfirmSubject.next(answerConfirm);
  }
}
