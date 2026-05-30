import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity.js';
import { PurchaseService } from './purchase.service.js';
import { PurchaseController } from './purchase.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
