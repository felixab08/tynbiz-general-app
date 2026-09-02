import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreationsService, JitsiService } from '@app/services';
import { CarouselProductsCreation } from '@app/components';

@Component({
  selector: 'tyn-your-creation',
  imports: [NgClass, CarouselProductsCreation],
  templateUrl: './yourcreation.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export default class YourCreation {
  _CreationsSrv = inject(CreationsService);
  _jitsiSrv = inject(JitsiService);
  creationsResource = rxResource({
    params: () => ({
      page: 0,
      size: 100,
    }),
    stream: ({ params }) => {
      return (
        this._CreationsSrv.getYourCreations({
          page: params.page,
          size: params.size,
        }) || {}
      );
    },
  });
  createJitsi(selectedcreations: any) {
    this._jitsiSrv.createJitsi(selectedcreations?.videoRoomUrl);
  }
}
