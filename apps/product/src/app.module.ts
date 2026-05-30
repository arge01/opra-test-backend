import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import databaseConfig from './config/database.config.js';
import { ProductModule } from './modules/product/product.module.js';
import { UserModule } from './modules/user/user.module.js';
import { PurchaseModule } from './modules/purchase/purchase.module.js';
import { SeederModule } from './seeder/seeder.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { OpraHttpModule } from '@opra/nestjs-http';

import { ProductController } from './modules/product/product.controller.js';
import { UserController } from './modules/user/user.controller.js';
import { PurchaseController } from './modules/purchase/purchase.controller.js';
import { AuthController } from './modules/auth/auth.controller.js';

import { ProductType } from './modules/product/product.schema.js';
import { UserType } from './modules/user/user.schema.js';
import { PurchaseType } from './modules/purchase/purchase.schema.js';
import { LoginInputType, LoginResponseType } from './modules/auth/auth.schema.js';

@Module({
  imports: [
    OpraHttpModule.forRoot({
      name: 'opra-test',
      description: 'Test API',
      types: [ProductType, UserType, PurchaseType, LoginInputType, LoginResponseType],
      controllers: [ProductController, UserController, PurchaseController, AuthController],
      imports: [ProductModule, UserModule, PurchaseModule, AuthModule],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>('database')!,
    }),
    AuthModule,
    ProductModule,
    UserModule,
    PurchaseModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
