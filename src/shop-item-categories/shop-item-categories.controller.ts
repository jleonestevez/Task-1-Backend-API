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
import { ShopItemCategoriesService } from './shop-item-categories.service';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';
import { ShopItemCategory } from './entities/shop-item-category.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('shop-item-categories')
@Controller('shop-item-categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopItemCategoriesController {
  constructor(private readonly shopItemCategoriesService: ShopItemCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop item category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: ShopItemCategory })
  @ApiBody({
    type: CreateShopItemCategoryDto,
    description: 'Category creation data',
    examples: {
      electronics: {
        summary: 'Electronics category',
        description: 'Example for creating an electronics category',
        value: {
          title: 'Electronics',
          description: 'Electronic devices and accessories'
        }
      },
      clothing: {
        summary: 'Clothing category',
        description: 'Example for creating a clothing category',
        value: {
          title: 'Clothing',
          description: 'Apparel and fashion items'
        }
      },
      books: {
        summary: 'Books category',
        description: 'Example for creating a books category',
        value: {
          title: 'Books'
        }
      }
    }
  })
  create(@Body() createShopItemCategoryDto: CreateShopItemCategoryDto) {
    return this.shopItemCategoriesService.create(createShopItemCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shop item categories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (max 100)', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of categories',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/ShopItemCategory' } },
        total: { type: 'number', example: 8 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 1 },
        hasNext: { type: 'boolean', example: false },
        hasPrev: { type: 'boolean', example: false },
      }
    }
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.shopItemCategoriesService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shop item category by ID' })
  @ApiResponse({ status: 200, description: 'Category found', type: ShopItemCategory })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopItemCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shop item category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: ShopItemCategory })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBody({
    type: UpdateShopItemCategoryDto,
    description: 'Category update data',
    examples: {
      title: {
        summary: 'Update title only',
        description: 'Example for updating only the category title',
        value: {
          title: 'Updated Electronics'
        }
      },
      description: {
        summary: 'Update description only',
        description: 'Example for updating only the category description',
        value: {
          description: 'Updated description for electronic devices'
        }
      },
      full: {
        summary: 'Full update',
        description: 'Example for updating both title and description',
        value: {
          title: 'Home & Garden',
          description: 'Home improvement and garden supplies'
        }
      }
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShopItemCategoryDto: UpdateShopItemCategoryDto) {
    return this.shopItemCategoriesService.update(id, updateShopItemCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shop item category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shopItemCategoriesService.remove(id);
  }
}