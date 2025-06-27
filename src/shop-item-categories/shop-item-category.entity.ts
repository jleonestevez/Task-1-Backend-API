import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ShopItem } from '../shop-items/shop-item.entity';

@Entity()
export class ShopItemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => ShopItem, (item) => item.categories)
  items: ShopItem[];
} 