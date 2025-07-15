import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Pipe({ name: 'notImage' })
export class NotImagePipe implements PipeTransform {
  transform(value: string | string[]): any {
    if (!value) {
      return './assets/img/no-image.jpg';
    }
    return value;
    //   if (typeof value === 'string') {
    //     return `${baseUrl}/files/product/${value}`;
    //   }
    //   const image = value.at(0);
    //   if (!image) {
    //     return './assets/img/no-image.jpg';
    //   }
    //   return `${baseUrl}/files/product/${image}`;
    // }
  }
}
