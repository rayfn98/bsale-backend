import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductsService } from './products/products.service';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/categories.entity';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ScheduleModule } from '@nestjs/schedule';

// Opciones generales de la aplicación
const defaultOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
  port: 3306,
  username: 'bsale_test',
  password: 'bsale_test',
  database: 'bsale_test',
  // Desactivar ya que no se crea nuevas tablas o migraciones
  synchronize: false,
};
@Module({
  imports: [
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      ...defaultOptions,
      entities: [Product, Category],
      // Para prevenir la demora de conexión la primera vez
      logging: 'all',
      retryDelay: 3000,
      retryAttempts: 10,
    }),

    //Entidades que representan las tablas de la BDD
    TypeOrmModule.forFeature([Product, Category]),
  ],

  // Controladores de la aplicación
  controllers: [AppController, ProductsController, CategoriesController],

  // Servicios de la aplicación
  providers: [AppService, ProductsService, CategoriesService],
})
export class AppModule {}
