import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ example: 1 })
  customerId?: number;

  @ApiPropertyOptional({
    example: [
      { shopItemId: 3, quantity: 2 },
      { shopItemId: 5, quantity: 1 },
    ],
  })
  items?: any[];
} 