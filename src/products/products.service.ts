import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Like } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return await this, this.productRepository.find();
  }

  async getById(searchId: number) {
    const product = this.productRepository.findOneBy({
      id: searchId,
    });
    return await this, product;
  }

  async searchByName(query: string) {
    const response = this.productRepository.find({
      where: { name: Like(`%${query}%`) },
    });
    return await this, response;
  }

  async getByCategory(categoryId: number) {
    const products = this.productRepository.find({
      where: { category: categoryId },
    });
    return await this, products;
  }
}
