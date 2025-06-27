import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateShopItemCategoryDto } from './create-shop-item-category.dto';

export class UpdateShopItemCategoryDto extends PartialType(CreateShopItemCategoryDto) {
  @ApiPropertyOptional({ example: 'Electrónica' })
  title?: string;

  @ApiPropertyOptional({ example: 'Dispositivos y gadgets' })
  description?: string;
} 