import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'The unique identifier of the order' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The customer who placed this order', type: () => Customer })
  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;

  @ApiProperty({ description: 'The items in this order', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ description: 'The date the order was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date the order was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}