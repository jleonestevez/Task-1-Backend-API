import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    example: [
      { shopItemId: 3, quantity: 2 },
      { shopItemId: 5, quantity: 1 },
    ],
    type: [CreateOrderItemDto],
  })
  @IsArray()
  items: CreateOrderItemDto[];
} 