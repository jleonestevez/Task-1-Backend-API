import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ShopItemCategory } from '../shop-item-categories/shop-item-category.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity()
export class ShopItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  price: number;

  @ManyToMany(() => ShopItemCategory, (category) => category.items, { cascade: true })
  @JoinTable()
  categories: ShopItemCategory[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.shopItem)
  orderItems: OrderItem[];
} 