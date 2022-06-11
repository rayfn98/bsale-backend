import { Controller, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
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
