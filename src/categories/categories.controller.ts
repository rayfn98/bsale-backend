import { Controller, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

// CONTROLADOR DE CATEGORÍA
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesServices: CategoriesService) {}

  // Obtener lista de todas las categorías
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
