import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tyz-admin',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export default class AdminComponent {}
