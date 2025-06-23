import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { actionsMockUser } from '@app/mock/actions.mock';
import { sessionsMockUser } from '@app/mock/sessions.mock';

@Component({
  selector: 'tyn-user-detail-actions-page',
  imports: [CommonModule],
  templateUrl: './user-detail-actions-page.component.html',
})
export class UserDetailActionsPageComponent {
  private sessions = sessionsMockUser;
  private actions = actionsMockUser;
  userInfo = input.required<any>();

  getUserSessionsById() {
    return this.sessions.filter((action) =>
      this.userInfo().idSessions.includes(action.id)
    );
  }
  getUserActionsById() {
    return this.actions.filter((action) =>
      this.userInfo().idActions.includes(action.id)
    );
  }
}
