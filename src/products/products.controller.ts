import { Controller, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  @Get()
  getAll(@Res() response) {
    this.productsServices
      .getAll()
      .then((productsList) => {
        response.status(HttpStatus.OK).json(productsList);
      })
      .catch((e) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ mensaje: 'Error al obtener productos', e });
      });
  }
}
