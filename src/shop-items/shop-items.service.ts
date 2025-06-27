import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShopItem } from './shop-item.entity';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItemCategory } from '../shop-item-categories/shop-item-category.entity';

@Injectable()
export class ShopItemsService {
  constructor(
    @InjectRepository(ShopItem)
    private readonly itemsRepository: Repository<ShopItem>,
    @InjectRepository(ShopItemCategory)
    private readonly categoriesRepository: Repository<ShopItemCategory>,
  ) {}

  async create(dto: CreateShopItemDto): Promise<ShopItem> {
    const item = this.itemsRepository.create({
      title: dto.title,
      description: dto.description,
      price: dto.price,
    });

    if (dto.categoryIds?.length) {
      const categories = await this.categoriesRepository.findByIds(dto.categoryIds);
      item.categories = categories;
    }
    return this.itemsRepository.save(item);
  }

  findAll(): Promise<ShopItem[]> {
    return this.itemsRepository.find({ relations: ['categories'] });
  }

  async findOne(id: number): Promise<ShopItem> {
    const item = await this.itemsRepository.findOne({ where: { id }, relations: ['categories'] });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  async update(id: number, dto: UpdateShopItemDto): Promise<ShopItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    if (dto.categoryIds) {
      const categories = await this.categoriesRepository.findByIds(dto.categoryIds);
      item.categories = categories;
    }
    return this.itemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);
  }
} 