import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ShopItem } from '../../shop-items/entities/shop-item.entity';

@Entity('shop_item_categories')
export class ShopItemCategory {
  @ApiProperty({ description: 'The unique identifier of the category' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the category' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The description of the category' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'The shop items in this category', type: () => [ShopItem] })
  @ManyToMany(() => ShopItem, shopItem => shopItem.categories)
  shopItems: ShopItem[];

  @ApiProperty({ description: 'The date when the category was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the category was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}