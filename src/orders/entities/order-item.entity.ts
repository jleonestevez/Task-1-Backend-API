import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ShopItem } from '../../shop-items/entities/shop-item.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'The unique identifier of the order item' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The quantity of the shop item in this order' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'The shop item', type: () => ShopItem })
  @ManyToOne(() => ShopItem, shopItem => shopItem.orderItems)
  shopItem: ShopItem;

  @ApiProperty({ description: 'The order this item belongs to', type: () => Order })
  @ManyToOne(() => Order, order => order.items)
  order: Order;
}