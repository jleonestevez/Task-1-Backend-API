import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';
import { ShopItemCategory } from './entities/shop-item-category.entity';

@Injectable()
export class ShopItemCategoriesService {
  constructor(
    @InjectRepository(ShopItemCategory)
    private readonly categoryRepository: Repository<ShopItemCategory>,
  ) {}

  async create(createShopItemCategoryDto: CreateShopItemCategoryDto): Promise<ShopItemCategory> {
    const category = this.categoryRepository.create(createShopItemCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.categoryRepository.findAndCount({
      relations: ['shopItems'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }

  async findOne(id: number): Promise<ShopItemCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['shopItems'],
    });

    if (!category) {
      throw new NotFoundException(`Shop item category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateShopItemCategoryDto: UpdateShopItemCategoryDto): Promise<ShopItemCategory> {
    await this.findOne(id); // Check if exists
    await this.categoryRepository.update(id, updateShopItemCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}