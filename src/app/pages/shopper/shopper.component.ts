import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tyz-shopper',
  imports: [RouterOutlet],
  template: '<div class="body-primary"><div class="body-secondary"><router-outlet /></div></div>',
})
export default class ShopperComponent {}
