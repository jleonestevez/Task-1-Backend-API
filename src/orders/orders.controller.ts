import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Customer or shop item not found' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation data',
    examples: {
      single: {
        summary: 'Single item order',
        description: 'Example for creating an order with one item',
        value: {
          customerId: 1,
          items: [
            {
              shopItemId: 1,
              quantity: 1
            }
          ]
        }
      },
      multiple: {
        summary: 'Multiple items order',
        description: 'Example for creating an order with multiple items',
        value: {
          customerId: 2,
          items: [
            {
              shopItemId: 1,
              quantity: 2
            },
            {
              shopItemId: 3,
              quantity: 1
            },
            {
              shopItemId: 5,
              quantity: 3
            }
          ]
        }
      },
      large: {
        summary: 'Large quantity order',
        description: 'Example for creating an order with large quantities',
        value: {
          customerId: 1,
          items: [
            {
              shopItemId: 2,
              quantity: 10
            }
          ]
        }
      }
    }
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (max 100)', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of orders',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
        total: { type: 'number', example: 30 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false },
      }
    }
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Order update data',
    examples: {
      customer: {
        summary: 'Update customer only',
        description: 'Example for changing the customer of an order',
        value: {
          customerId: 3
        }
      },
      items: {
        summary: 'Update items only',
        description: 'Example for updating order items',
        value: {
          items: [
            {
              shopItemId: 1,
              quantity: 3
            },
            {
              shopItemId: 4,
              quantity: 1
            }
          ]
        }
      },
      full: {
        summary: 'Full update',
        description: 'Example for updating both customer and items',
        value: {
          customerId: 2,
          items: [
            {
              shopItemId: 2,
              quantity: 5
            }
          ]
        }
      }
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}