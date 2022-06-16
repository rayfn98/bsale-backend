# Desafío BSALE - Backend
Aplicación Backend de Tienda en línea desarrollada con NestJS, en el cuál se conectó la base de datos y se realizaron los servicios para que sean consumidas en el lado del cliente. También cuenta con estrategia Keep Alive implementándose un pool de conexiones y una tarea programada con el intervalo de 3 segundos que mantiene la sesión abierta con la base de datos para que la conexión sea persistente.

## Tecnologías
- NestJS con TypeORM
- nestjs/schedule "Para KEEP ALIVE"
- HEROKU

## API REST
URL: https://desafiobsale.herokuapp.com

### 1. Obtener todos los productos
GET: /products

#### Respuesta: El backend devuelve la lista con la siguiente estructura JSON 
```JSON
[
  {
    "id": 5,
    "name": "ENERGETICA MR BIG",
    "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/misterbig3308256.jpg",
    "price": 1490,
    "discount": 20,
    "category": 1
  },
  {
    "id": 6,
    "name": "ENERGETICA RED BULL",
    "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/redbull8381.jpg",
    "price": 1490,
    "discount": 0,
    "category": 1
  },
]
```

### 2. Obtener producto por ID
GET: /products/:id
Se envia el id del producto del cuál se dese obtener

#### Respuesta: El backend devuelve la lista con la siguiente estructura JSON con la información del producto
```JSON 
{
  "id": 5,
  "name": "ENERGETICA MR BIG",
  "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/misterbig3308256.jpg",
  "price": 1490,
  "discount": 20,
  "category": 1
}
```

### 3. Filtrar productos por Categoría
GET: /products/category/:id
Se envia el id de la categoría de la cuál se dese obtener sus productos

#### Respuesta: El backend devuelve la lista con la siguiente estructura JSON con la lista filtrada
```JSON [
    {
        "id": 5,
        "name": "ENERGETICA MR BIG",
        "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/misterbig3308256.jpg",
        "price": 1490,
        "discount": 20,
        "category": 1
    },
    {
        "id": 6,
        "name": "ENERGETICA RED BULL",
        "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/redbull8381.jpg",
        "price": 1490,
        "discount": 0,
        "category": 1
    },
]
```

### 4. Filtrar por búsqueda escrita
POST: /products/search?s=<query>
Se envia el query mediante la url con el parámetro "s"

#### Respuesta: El backend devuelve la lista con la siguiente estructura JSON con la lista de los productos que contienen el query enviado
```JSON
  [
    {
        "id": 23,
        "name": "RON BACARDI AÑEJO",
        "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/bacardi9450.jpg",
        "price": 4990,
        "discount": 0,
        "category": 3
    },
    {
        "id": 24,
        "name": "RON BACARDI 8 AÑOS",
        "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/bacardianejo9463.jpg",
        "price": 5990,
        "discount": 0,
        "category": 3
    },
    {
        "id": 25,
        "name": "RON ABUELO",
        "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/abuelo9475.jpg",
        "price": 3990,
        "discount": 0,
        "category": 3
    },
]
```
  
### 5. Obtener oferta
GET: /offer
Se envía el enlace con offer que te brinda la oferta actualizada por el backend automáticamente

#### Respuesta: El backend devuelve una oferta aleatoriamente ya obtenida
```JSON
{
  "id": 15,
  "name": "PISCO ESPIRITU DEL ELQUI 45º",
  "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/espiritu8957.jpg",
  "price": 6990,
  "discount": 5,
  "category": 2
}
```

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
## Deployment

1. En el caso de no haber inicializado git
```bash
 git init
 git branch -M main
 git add -A
 git commit -m "Git inicializado"
```
2. Iniciar sesión en Heroku y crear app:
```bash
heroku login
```
- Luego de iniciar sesión 
```bash
-  heroku apps:create <nombre_app>
```
3. Subir proyecto a Heroku: 
```bash 
git push heroku main
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
