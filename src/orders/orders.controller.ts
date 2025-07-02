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

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({ type: Order })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [Order] })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Order })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: Order })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(Number(id));
  }
} 