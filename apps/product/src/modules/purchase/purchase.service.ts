import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './purchase.entity.js';
import { PurchaseType } from './purchase.schema.js';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async findMany(options: { limit: number; skip: number }) {
    return this.purchaseRepository.find({
      take: options.limit,
      skip: options.skip,
      order: { purchasedAt: 'DESC' },
      relations: ['product'],
    });
  }

  async get(id: string) {
    const purchase = await this.purchaseRepository.findOne({ 
      where: { id },
      relations: ['product']
    });
    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${id} not found`);
    }
    return purchase;
  }

  async create(data: Partial<PurchaseType>) {
    const purchase = this.purchaseRepository.create(data);
    return this.purchaseRepository.save(purchase);
  }

  async update(id: string, data: Partial<PurchaseType>) {
    const purchase = await this.get(id);
    Object.assign(purchase, data);
    return this.purchaseRepository.save(purchase);
  }

  async delete(id: string) {
    const purchase = await this.get(id);
    await this.purchaseRepository.remove(purchase);
    return { success: true };
  }
}
