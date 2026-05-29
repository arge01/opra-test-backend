import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Product } from '../product/product.entity.js';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  purchasedAt: Date;

  @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ManyToOne(() => Product, (product) => product.purchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;
}
