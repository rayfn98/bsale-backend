import {
  Controller,
  Get,
  Body,
  Res,
  HttpStatus,
  Param,
  Req,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request } from 'express';

@Controller()
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  @Get('products')
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

  @Get('products/:id')
  getById(@Res() response, @Param('id') id) {
    this.productsServices
      .getById(id)
      .then((product) => {
        response.status(HttpStatus.OK).json(product);
      })
      .catch((e) => {
        response.status(HttpStatus.FORBIDDEN).json({
          mensaje: 'Error al obtener producto',
          e,
          a: { params: id },
        });
      });
  }

  @Post('products/search')
  geatByQuery(@Res() response, @Req() req: Request) {
    const s = `%${req.query.s}%`;
    this.productsServices
      .searchByName(s)
      .then((product) => {
        response.status(HttpStatus.OK).json(product);
      })
      .catch((e) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ mensaje: 'Error al obtener producto', e });
      });
  }

  @Get('products/category/:id')
  getByCategory(@Res() response, @Param('id') id) {
    const categoryId = parseInt(id, 10);
    this.productsServices
      .getByCategory(categoryId)
      .then((products) => {
        response.status(HttpStatus.OK).json(products);
      })
      .catch((e) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ mensaje: 'Error al obtener productos', e, id: id });
      });
  }

  @Get('offer')
  getNewOffer(@Res() response) {
    this.productsServices
      .getNewOffer()
      .then((product) => {
        response.status(HttpStatus.OK).json(product);
      })
      .catch((e) => {
        response.status(HttpStatus.FORBIDDEN).json({
          mensaje: 'Error al obtener producto',
          e,
        });
      });
  }
}
