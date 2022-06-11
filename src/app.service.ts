import { Injectable } from '@nestjs/common';
const offers: string[] = [
  'S/. 10 de Descuento con el código BSALE10',
  'S/. 20  con el código BSALE20',
  'Obtén S/. 30  con el código BSALE10',
  'Obtén S/. 50 de descuento en tu primera compra',
];
@Injectable()
export class AppService {
  getNewOffer(): string {
    const offer: string = offers[Math.floor(Math.random() * (4 - 0) + 0)];
    return offer;
  }
}
