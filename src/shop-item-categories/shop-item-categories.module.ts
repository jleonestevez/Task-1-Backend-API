import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItemCategoriesService } from './shop-item-categories.service';
import { ShopItemCategoriesController } from './shop-item-categories.controller';
import { ShopItemCategory } from './entities/shop-item-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItemCategory])],
  controllers: [ShopItemCategoriesController],
  providers: [ShopItemCategoriesService],
  exports: [ShopItemCategoriesService],
})
export class ShopItemCategoriesModule {}