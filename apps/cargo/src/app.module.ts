import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpraHttpModule } from '@opra/nestjs-http';
import { ShipmentModule } from './shipment/shipment.module.js';
import { Shipment } from './shipment/shipment.entity.js';
import { ShipmentController } from './shipment/shipment.controller.js';
import { ShipmentType } from './shipment/shipment.schema.js';

@Module({
  imports: [
    OpraHttpModule.forRoot({
      name: 'opra-cargo',
      description: 'Cargo API',
      types: [ShipmentType],
      controllers: [ShipmentController],
      imports: [ShipmentModule],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'opra_cargo.sqlite',
      entities: [Shipment],
      synchronize: true, // For development only
    }),
    ShipmentModule,
  ],
})
export class AppModule {}
