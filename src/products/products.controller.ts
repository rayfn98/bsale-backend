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

  @Get(':id')
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

  @Post('search')
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

  @Get('category/:id')
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
}
