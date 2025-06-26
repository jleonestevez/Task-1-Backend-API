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
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('customers')
@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: Customer })
  @ApiResponse({ status: 409, description: 'Customer with email already exists' })
  @ApiBody({
    type: CreateCustomerDto,
    description: 'Customer creation data',
    examples: {
      customer1: {
        summary: 'Customer example 1',
        description: 'Example for creating a customer',
        value: {
          name: 'Juan',
          surname: 'Pérez',
          email: 'juan.perez@example.com',
          password: 'customerPass123'
        }
      },
      customer2: {
        summary: 'Customer example 2',
        description: 'Another example for creating a customer',
        value: {
          name: 'María',
          surname: 'García',
          email: 'maria.garcia@example.com',
          password: 'securePass456'
        }
      }
    }
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (max 100)', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of customers',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Customer' } },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false },
      }
    }
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Customer with email already exists' })
  @ApiBody({
    type: UpdateCustomerDto,
    description: 'Customer update data',
    examples: {
      partial: {
        summary: 'Partial update example',
        description: 'Example for updating only some customer fields',
        value: {
          name: 'Juan Carlos',
          surname: 'Pérez González'
        }
      },
      email: {
        summary: 'Email update example',
        description: 'Example for updating customer email',
        value: {
          email: 'newemail@example.com'
        }
      },
      password: {
        summary: 'Password update example',
        description: 'Example for updating customer password',
        value: {
          password: 'newSecurePassword789'
        }
      }
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}