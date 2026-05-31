import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpraHttpModule } from '@opra/nestjs-http';
import { ShipmentModule } from './shipment/shipment.module.js';
import { Shipment } from './shipment/shipment.entity.js';
import { ShipmentController } from './shipment/shipment.controller.js';
import { ShipmentType } from './shipment/shipment.schema.js';
import { ShipmentStatus } from './shipment/shipment.enum.js';

@Module({
  imports: [
    OpraHttpModule.forRoot({
      name: 'opra-cargo',
      description: 'Cargo API',
      types: [ShipmentType, ShipmentStatus],
      controllers: [ShipmentController],
      imports: [ShipmentModule],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_DATABASE', 'opra'),
        entities: [Shipment],
        synchronize: true, // For development only
      }),
    }),
    ShipmentModule,
  ],
})
export class AppModule {}
