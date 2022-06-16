import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  Req,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request } from 'express';

// CONTROLADOR DE PRODUCTOS

@Controller()
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  // Obtener lista de todos los productos
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

  // Obtener producto por ID,
  // usado para añadir al carrito
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

  // Filtrar por nombre mediante query
  // Usado en el buscador y filtra los productos que contienen el Query ingresado
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

  // Obtener productos de una determinada categoría
  // mediante el ID
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

  // Obtener la offerta actual que se encuentra en el backend
  /* Esta oferta se va actualizando cada 3 segundos (KEEP ALIVE)
     Este controlador envía esa oferta */
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
