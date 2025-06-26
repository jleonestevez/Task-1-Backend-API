import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShopItemCategoryDto {
  @ApiProperty({ 
    description: 'The title of the category',
    example: 'Electronics' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ 
    description: 'The description of the category',
    example: 'Electronic devices and accessories' 
  })
  @IsString()
  @IsOptional()
  description?: string;
}