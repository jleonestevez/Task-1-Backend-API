import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItemsService } from './shop-items.service';
import { ShopItemsController } from './shop-items.controller';
import { ShopItem } from './entities/shop-item.entity';
import { ShopItemCategory } from '../shop-item-categories/entities/shop-item-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItem, ShopItemCategory])],
  controllers: [ShopItemsController],
  providers: [ShopItemsService],
  exports: [ShopItemsService],
})
export class ShopItemsModule {}