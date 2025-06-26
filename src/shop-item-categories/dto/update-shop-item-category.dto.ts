import { PartialType } from '@nestjs/swagger';
import { CreateShopItemCategoryDto } from './create-shop-item-category.dto';

export class UpdateShopItemCategoryDto extends PartialType(CreateShopItemCategoryDto) {}