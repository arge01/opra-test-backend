import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity.js';
import { ShipmentController } from './shipment.controller.js';
import { ShipmentService } from './shipment.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
  exports: [ShipmentService],
})
export class ShipmentModule {}
