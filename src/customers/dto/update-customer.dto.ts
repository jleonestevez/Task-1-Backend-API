import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiPropertyOptional({ example: 'Ada' })
  name?: string;

  @ApiPropertyOptional({ example: 'Lovelace' })
  surname?: string;

  @ApiPropertyOptional({ example: 'ada@lovelace.dev' })
  email?: string;
} 