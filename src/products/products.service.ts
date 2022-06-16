import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Like } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  newOffer;
  
  // Se declara el repositorio de producto que vincula a la base de datos
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}


  // Obtiene la lista de todos los productos
  async getAll() {
    return await this, this.productRepository.find();
  }

  // Obtener producto individual / Usado en añadir al carrito para obtener la información
  async getById(searchId: number) {
    const product = this.productRepository.findOneBy({
      id: searchId,
    });
    return await this, product;
  }

  // Filtra por nombre
  async searchByName(query: string) {
    let response = this.productRepository.find({
      where: [{ name: Like(`%${query}%`) }],
    });
    return await this, response;
  }

  // Filtra por categoría
  async getByCategory(categoryId: number) {
    const products = this.productRepository.find({
      where: { category: categoryId },
    });
    return await this, products;
  }

  // Keep Alive Strategy // Etrategia de Keep Alive
  // Obtiene una nueva oferta aleatoria cada 3 segundos
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

  // Envía la oferta actual obtenida por el método anterior
  // con el fin de testear la consistencia de conexión usando Keep Alive
  async getNewOffer() {
    return await this, this.newOffer;
  }
}
