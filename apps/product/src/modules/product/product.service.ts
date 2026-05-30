import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { ProductType } from './product.schema.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findMany(options: { limit?: number; skip?: number; sort?: string[] }): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    
    if (options.limit) {
      query.take(options.limit);
    }
    if (options.skip) {
      query.skip(options.skip);
    }
    
    // Sort handling would go here

    return query.getMany();
  }

  async get(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(data: Partial<ProductType>): Promise<Product> {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: string, data: Partial<ProductType>): Promise<Product> {
    const product = await this.get(id);
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return (result.affected || 0) > 0;
  }
}
