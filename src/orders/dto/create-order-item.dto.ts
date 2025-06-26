import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ 
    description: 'The ID of the shop item',
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  shopItemId: number;

  @ApiProperty({ 
    description: 'The quantity of the shop item',
    example: 2 
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}