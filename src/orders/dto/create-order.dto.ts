import { IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'The ID of the customer placing the order',
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  customerId: number;

  @ApiProperty({ 
    description: 'The items in the order',
    example: [
      { shopItemId: 1, quantity: 2 },
      { shopItemId: 3, quantity: 1 }
    ],
    type: [CreateOrderItemDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}