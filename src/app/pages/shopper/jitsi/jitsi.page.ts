import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JitsiComponent } from '@app/components';

@Component({
  selector: 'tyn-jitsi.page',
  imports: [JitsiComponent],
  templateUrl: './jitsi.page.html',
})
export default class JitsiPage {
  private _route = inject(ActivatedRoute);
  public idContenido: number | null = null;

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      this.idContenido = Number(params.get('idContenido'));
      console.log(this.idContenido);
    });
  }
}
