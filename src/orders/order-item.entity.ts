import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ShopItem } from '../shop-items/shop-item.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShopItem, (item) => item.orderItems, { eager: true })
  shopItem: ShopItem;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
} 