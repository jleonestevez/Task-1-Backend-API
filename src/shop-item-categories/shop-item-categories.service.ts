import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShopItemCategory } from './shop-item-category.entity';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';

@Injectable()
export class ShopItemCategoriesService {
  constructor(
    @InjectRepository(ShopItemCategory)
    private readonly categoriesRepository: Repository<ShopItemCategory>,
  ) {}

  create(dto: CreateShopItemCategoryDto): Promise<ShopItemCategory> {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<ShopItemCategory[]> {
    return this.categoriesRepository.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<ShopItemCategory> {
    const category = await this.categoriesRepository.findOne({ where: { id }, relations: ['items'] });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateShopItemCategoryDto): Promise<ShopItemCategory> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
} 