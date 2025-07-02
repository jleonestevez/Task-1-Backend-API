import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './customer.entity';

@ApiTags('customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiCreatedResponse({ type: Customer, description: 'The created customer' })
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [Customer] })
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Customer })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: Customer })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(Number(id));
  }
} 