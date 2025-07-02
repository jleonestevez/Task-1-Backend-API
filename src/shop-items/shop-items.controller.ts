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

import { ShopItemsService } from './shop-items.service';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItem } from './shop-item.entity';

@ApiTags('shop-items')
@ApiBearerAuth()
@Controller('shop-items')
export class ShopItemsController {
  constructor(private readonly itemsService: ShopItemsService) {}

  @Post()
  @ApiCreatedResponse({ type: ShopItem })
  create(@Body() dto: CreateShopItemDto): Promise<ShopItem> {
    return this.itemsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [ShopItem] })
  findAll(): Promise<ShopItem[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ShopItem })
  findOne(@Param('id') id: string): Promise<ShopItem> {
    return this.itemsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: ShopItem })
  update(@Param('id') id: string, @Body() dto: UpdateShopItemDto): Promise<ShopItem> {
    return this.itemsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(Number(id));
  }
} 