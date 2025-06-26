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
import { ShopItemsService } from './shop-items.service';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItem } from './entities/shop-item.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('shop-items')
@Controller('shop-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopItemsController {
  constructor(private readonly shopItemsService: ShopItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop item' })
  @ApiResponse({ status: 201, description: 'Shop item created successfully', type: ShopItem })
  @ApiResponse({ status: 404, description: 'One or more categories not found' })
  @ApiBody({
    type: CreateShopItemDto,
    description: 'Shop item creation data',
    examples: {
      laptop: {
        summary: 'Gaming Laptop',
        description: 'Example for creating a gaming laptop product',
        value: {
          title: 'Gaming Laptop',
          description: 'High-performance gaming laptop with RGB keyboard',
          price: 1299.99,
          categoryIds: [1, 2]
        }
      },
      smartphone: {
        summary: 'Smartphone',
        description: 'Example for creating a smartphone product',
        value: {
          title: 'iPhone 15 Pro',
          description: 'Latest iPhone with A17 Pro chip',
          price: 999.99,
          categoryIds: [1]
        }
      },
      book: {
        summary: 'Book without categories',
        description: 'Example for creating a book without categories',
        value: {
          title: 'JavaScript: The Good Parts',
          description: 'A comprehensive guide to JavaScript programming',
          price: 39.99
        }
      }
    }
  })
  create(@Body() createShopItemDto: CreateShopItemDto) {
    return this.shopItemsService.create(createShopItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shop items with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (max 100)', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of shop items',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/ShopItem' } },
        total: { type: 'number', example: 50 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 5 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false },
      }
    }
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.shopItemsService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shop item by ID' })
  @ApiResponse({ status: 200, description: 'Shop item found', type: ShopItem })
  @ApiResponse({ status: 404, description: 'Shop item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shop item' })
  @ApiResponse({ status: 200, description: 'Shop item updated successfully', type: ShopItem })
  @ApiResponse({ status: 404, description: 'Shop item not found' })
  @ApiBody({
    type: UpdateShopItemDto,
    description: 'Shop item update data',
    examples: {
      price: {
        summary: 'Update price only',
        description: 'Example for updating only the item price',
        value: {
          price: 1199.99
        }
      },
      description: {
        summary: 'Update description',
        description: 'Example for updating the item description',
        value: {
          description: 'Updated description with new features'
        }
      },
      categories: {
        summary: 'Update categories',
        description: 'Example for updating item categories',
        value: {
          categoryIds: [1, 3, 4]
        }
      },
      full: {
        summary: 'Full update',
        description: 'Example for updating multiple fields',
        value: {
          title: 'Updated Gaming Laptop Pro',
          description: 'Premium gaming laptop with enhanced performance',
          price: 1499.99,
          categoryIds: [1, 2]
        }
      }
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShopItemDto: UpdateShopItemDto) {
    return this.shopItemsService.update(id, updateShopItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shop item' })
  @ApiResponse({ status: 200, description: 'Shop item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shop item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shopItemsService.remove(id);
  }
}