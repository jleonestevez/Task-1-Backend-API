import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ShopItemCategory } from '../../shop-item-categories/entities/shop-item-category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('shop_items')
export class ShopItem {
  @ApiProperty({ description: 'The unique identifier of the shop item' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the shop item' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The description of the shop item' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'The price of the shop item' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'The categories this shop item belongs to', type: () => [ShopItemCategory] })
  @ManyToMany(() => ShopItemCategory, category => category.shopItems)
  @JoinTable({
    name: 'shop_item_categories_mapping',
    joinColumn: { name: 'shop_item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: ShopItemCategory[];

  @ApiProperty({ description: 'The order items that reference this shop item', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.shopItem)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'The date when the shop item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the shop item was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}