import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShopItem } from './shop-item.entity';
import { ShopItemsService } from './shop-items.service';
import { ShopItemsController } from './shop-items.controller';
import { ShopItemCategory } from '../shop-item-categories/shop-item-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItem, ShopItemCategory])],
  controllers: [ShopItemsController],
  providers: [ShopItemsService],
  exports: [ShopItemsService],
})
export class ShopItemsModule {} 