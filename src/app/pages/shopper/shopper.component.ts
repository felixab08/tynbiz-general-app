import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tyz-shopper',
  imports: [RouterOutlet],
  template: '<div><div class="body-tbz"><router-outlet /></div></div>',
})
export default class ShopperComponent {}
