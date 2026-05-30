import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ShipmentStatus } from './shipment.enum.js';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column({
    type: 'varchar',
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
