import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Product } from '../modules/product/product.entity.js';
import { User } from '../modules/user/user.entity.js';
import { Purchase } from '../modules/purchase/purchase.entity.js';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
    await this.seedUsers();
    await this.seedPurchases();
  }

  private async seedProducts() {
    const count = await this.productRepository.count();
    if (count > 0) {
      this.logger.log(`Products table already has ${count} records. Skipping product seed.`);
      return;
    }

    this.logger.log('Seeding 5000 fake products...');

    const products: Partial<Product>[] = [];
    for (let i = 0; i < 5000; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: faker.string.uuid(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 500 }),
        isActive: faker.datatype.boolean(0.9), // 90% active
        image: faker.image.url(),
      });
    }

    // Bulk insert with chunks to avoid overwhelming the database
    const chunkSize = 1000;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(chunk)
        .execute();
      this.logger.log(`Inserted product chunk ${i / chunkSize + 1} of ${products.length / chunkSize}`);
    }

    this.logger.log('Successfully seeded 5000 products!');
  }

  private async seedUsers() {
    const count = await this.userRepository.count();
    if (count > 0) {
      this.logger.log(`Users table already has ${count} records. Skipping user seed.`);
      return;
    }

    this.logger.log('Seeding 50 fake users...');
    const users: User[] = [];
    for (let i = 0; i < 50; i++) {
      const user = this.userRepository.create({
        email: faker.internet.email(),
        password: 'password123', // Will be hashed by @BeforeInsert hook
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isActive: faker.datatype.boolean(0.9),
      });
      users.push(user);
    }
    await this.userRepository.save(users);
    this.logger.log('Successfully seeded 50 users!');
  }

  private async seedPurchases() {
    const count = await this.purchaseRepository.count();
    if (count > 0) {
      this.logger.log(`Purchases table already has ${count} records. Skipping purchase seed.`);
      return;
    }

    this.logger.log('Seeding 200 fake purchases...');
    const users = await this.userRepository.find({ select: ['id'] });
    const products = await this.productRepository.find({ select: ['id'], take: 500 }); // taking subset for speed

    if (!users.length || !products.length) {
      this.logger.warn('Not enough users or products to seed purchases.');
      return;
    }

    const purchases: Partial<Purchase>[] = [];
    for (let i = 0; i < 200; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];

      purchases.push({
        userId: randomUser.id,
        productId: randomProduct.id,
        quantity: faker.number.int({ min: 1, max: 10 }),
        purchasedAt: faker.date.recent({ days: 30 }),
      });
    }

    await this.purchaseRepository
      .createQueryBuilder()
      .insert()
      .into(Purchase)
      .values(purchases)
      .execute();
    
    this.logger.log('Successfully seeded 200 purchases!');
  }
}
