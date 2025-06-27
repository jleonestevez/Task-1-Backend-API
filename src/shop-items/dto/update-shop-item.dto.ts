import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateShopItemDto } from './create-shop-item.dto';

export class UpdateShopItemDto extends PartialType(CreateShopItemDto) {
  @ApiPropertyOptional({ example: 'Laptop' })
  title?: string;

  @ApiPropertyOptional({ example: 'Portátil ultraligero' })
  description?: string;

  @ApiPropertyOptional({ example: 999.99 })
  price?: number;

  @ApiPropertyOptional({ example: [1, 2] })
  categoryIds?: number[];
} 