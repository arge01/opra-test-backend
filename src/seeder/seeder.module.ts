import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../modules/product/product.entity.js';
import { User } from '../modules/user/user.entity.js';
import { Purchase } from '../modules/purchase/purchase.entity.js';
import { SeederService } from './seeder.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Purchase])],
  providers: [SeederService],
})
export class SeederModule {}
