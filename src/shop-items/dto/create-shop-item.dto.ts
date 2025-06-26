import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateShopItemDto {
  @ApiProperty({ 
    description: 'The title of the shop item',
    example: 'Gaming Laptop' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ 
    description: 'The description of the shop item',
    example: 'High-performance gaming laptop with RGB keyboard' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'The price of the shop item',
    example: 1299.99 
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ 
    description: 'Array of category IDs that this shop item belongs to',
    example: [1, 2],
    type: [Number] 
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];
}