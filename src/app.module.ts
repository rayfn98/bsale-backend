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
const defaultOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
  port: 3306,
  username: 'bsale_test',
  password: 'bsale_test',
  database: 'bsale_test',
  synchronize: false,
};
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      entities: [Product, Category],
      logging: 'all',
      retryDelay: 3000,
      retryAttempts: 10,
    }),
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [AppController, ProductsController, CategoriesController],
  providers: [AppService, ProductsService, CategoriesService],
})
export class AppModule {}
