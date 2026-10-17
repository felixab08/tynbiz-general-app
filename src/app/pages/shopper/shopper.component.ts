import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tyz-shopper',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div class="body-tbz">
    <div class="2xl:max-w-7xl w-full m-auto"><router-outlet /></div>
  </div>`,
})
export default class ShopperComponent {}
