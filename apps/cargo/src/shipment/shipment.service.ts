import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity.js';
import { faker } from '@faker-js/faker';
import { ShipmentStatus } from './shipment.enum.js';

@Injectable()
export class ShipmentService implements OnModuleInit {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
  ) { }

  async onModuleInit() {
    const count = await this.shipmentRepository.count();
    if (count === 0) {
      console.log('Generating shipments for all products...');
      const statuses = Object.values(ShipmentStatus);
      // Since both are in the same MySQL DB now, we can query products directly using the manager
      await this.shipmentRepository.query("TRUNCATE TABLE shipments");
      const products = await this.shipmentRepository.manager.query('SELECT id FROM products');

      const shipments = products.map((product: any) =>
        this.shipmentRepository.create({
          productId: product.id,
          userId: faker.string.uuid(), // Generate a mock user id or fetch from users table
          status: faker.helpers.arrayElement(statuses),
        })
      );

      // Save in chunks to prevent large query packets
      for (let i = 0; i < shipments.length; i += 500) {
        await this.shipmentRepository.save(shipments.slice(i, i + 500));
      }
      console.log(`Generated ${shipments.length} shipments!`);
    }
  }

  async findMany(options: { limit: number; skip: number; productId?: string }) {
    const where: any = {};
    if (options.productId) {
      where.productId = options.productId;
    }

    return this.shipmentRepository.find({
      take: options.limit,
      skip: options.skip,
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async get(id: string) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });
    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }


    return shipment;
  }
}
