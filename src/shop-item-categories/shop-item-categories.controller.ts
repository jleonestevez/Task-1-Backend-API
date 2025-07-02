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

import { ShopItemCategoriesService } from './shop-item-categories.service';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';
import { ShopItemCategory } from './shop-item-category.entity';

@ApiTags('shop-item-categories')
@ApiBearerAuth()
@Controller('shop-item-categories')
export class ShopItemCategoriesController {
  constructor(private readonly categoriesService: ShopItemCategoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: ShopItemCategory })
  create(@Body() dto: CreateShopItemCategoryDto): Promise<ShopItemCategory> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [ShopItemCategory] })
  findAll(): Promise<ShopItemCategory[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ShopItemCategory })
  findOne(@Param('id') id: string): Promise<ShopItemCategory> {
    return this.categoriesService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: ShopItemCategory })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateShopItemCategoryDto,
  ): Promise<ShopItemCategory> {
    return this.categoriesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(Number(id));
  }
} 