import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItemCategory } from './shop-item-category.entity';
import { ShopItemCategoriesService } from './shop-item-categories.service';
import { ShopItemCategoriesController } from './shop-item-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItemCategory])],
  controllers: [ShopItemCategoriesController],
  providers: [ShopItemCategoriesService],
  exports: [ShopItemCategoriesService],
})
export class ShopItemCategoriesModule {} 