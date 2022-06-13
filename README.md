# Desafío BSALE - Backend
Aplicación Backend de Tienda en línea desarrollada con NestJS, en el cuál se realizaron los servicios para que sean consumidas en el lado del cliente.

## Tecnologías
- NestJS con TypeORM
- nestjs/schedule "Para KEEP ALIVE"
- HEROKU

## Keep Alive
La estrategia de Keep Alive se usó primero una conexión pool mediante TypeORM para mantener la sesión iniciada en el pool de conexiones.
Se solucionó el plazo de 5 segundos de la base de datos usando una tarea programada con el intervalo de 3 segundos. En el cuál se obtiene un producto oferta aleatoriamente para que así se mantenga la conexión activa y también el frontend pueda tener un banner de ofertas actualizada cada 7 segundos, que confirma la Persistencia de la conexión

## Filtros
Se realizaron servicios de:
- Obtener todas las categorías
- Obtener todos los productos
- Obtener producto por ID
- Filtrar productos por categoría
- Obtener productos que contengan un determinado "QUERY"
- KEEP ALIVE: Obtener oferta (Retorna la oferta)

## Código de KeepAlive:
Uso de cron para determinar el intervalo de tiempo
```javascript
  // Keep Alive Strategy
  @Cron('0/3 * * * * *')
  async requestNewOffer() {
    this.newOffer = this.productRepository
      .createQueryBuilder()
      .select('product')
      .from(Product, 'product')
      .where('product.discount > 0')
      .orderBy('RAND()')
      .getOne();

    return await this, this.newOffer;
  }
```
## Controladores

- ProductController
```javascript
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
```
- CategoryController
```javascript
import { Controller, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories ')
export class CategoriesController {
  constructor(private categoriesServices: CategoriesService) {}

  @Get()
  getAll(@Res() response) {
    this.categoriesServices
      .getAll()
      .then((categoriesList) => {
        response.status(HttpStatus.OK).json(categoriesList);
      })
      .catch((e) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ mensaje: 'Error al obtener categorías', e });
      });
  }
}
```

## Instalación

```bash
$ npm install
```

## Iniciar App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Frontend
https://github.com/rayfn98/desaf-o_bsale/

## Autor
Ray Flores Nolasco
### Contacto
- WhatsApp: +51929044032
- Email: rayfn98@gmail.com
- Linkedin: https://www.linkedin.com/in/rayfloresnolasco/

## NestJS
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
