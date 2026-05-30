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
  ) {}

  async onModuleInit() {
    const count = await this.shipmentRepository.count();
    if (count === 0) {
      console.log('Generating mock shipments...');
      const statuses = Object.values(ShipmentStatus);
      const shipments = [];
      for (let i = 0; i < 20; i++) {
        shipments.push(
          this.shipmentRepository.create({
            productId: faker.string.uuid(),
            userId: faker.string.uuid(),
            status: faker.helpers.arrayElement(statuses),
          }),
        );
      }
      await this.shipmentRepository.save(shipments);
      console.log('Mock shipments generated!');
    }
  }

  async findMany(options: { limit: number; skip: number }) {
    return this.shipmentRepository.find({
      take: options.limit,
      skip: options.skip,
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
