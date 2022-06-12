import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Like } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  newOffer;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}


  // All products list
  async getAll() {
    return await this, this.productRepository.find();
  }

  // Get individual product / Used for add to cart
  async getById(searchId: number) {
    const product = this.productRepository.findOneBy({
      id: searchId,
    });
    return await this, product;
  }

  // Filter by name
  async searchByName(query: string) {
    let response = this.productRepository.find({
      where: [{ name: Like(`%${query}%`) }],
    });
    return await this, response;
  }

  // Filter by category
  async getByCategory(categoryId: number) {
    const products = this.productRepository.find({
      where: { category: categoryId },
    });
    return await this, products;
  }

  // Keep Alive Strategy
  @Cron(CronExpression.EVERY_5_SECONDS)
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

  async getNewOffer() {
    return await this, this.newOffer;
  }
}
