import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItem } from './entities/shop-item.entity';
import { ShopItemCategory } from '../shop-item-categories/entities/shop-item-category.entity';

@Injectable()
export class ShopItemsService {
  constructor(
    @InjectRepository(ShopItem)
    private readonly shopItemRepository: Repository<ShopItem>,
    @InjectRepository(ShopItemCategory)
    private readonly categoryRepository: Repository<ShopItemCategory>,
  ) {}

  async create(createShopItemDto: CreateShopItemDto): Promise<ShopItem> {
    const { categoryIds, ...shopItemData } = createShopItemDto;
    
    const shopItem = this.shopItemRepository.create(shopItemData);

    // If category IDs are provided, fetch and assign them
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      
      if (categories.length !== categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
      
      shopItem.categories = categories;
    }

    return this.shopItemRepository.save(shopItem);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.shopItemRepository.findAndCount({
      relations: ['categories'],
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

  async findOne(id: number): Promise<ShopItem> {
    const shopItem = await this.shopItemRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!shopItem) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }

    return shopItem;
  }

  async update(id: number, updateShopItemDto: UpdateShopItemDto): Promise<ShopItem> {
    const { categoryIds, ...shopItemData } = updateShopItemDto;
    const shopItem = await this.findOne(id);

    // Update basic properties
    Object.assign(shopItem, shopItemData);

    // If category IDs are provided, fetch and assign them
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.find({
          where: { id: In(categoryIds) },
        });
        
        if (categories.length !== categoryIds.length) {
          throw new NotFoundException('One or more categories not found');
        }
        
        shopItem.categories = categories;
      } else {
        shopItem.categories = [];
      }
    }

    return this.shopItemRepository.save(shopItem);
  }

  async remove(id: number): Promise<void> {
    const shopItem = await this.findOne(id);
    await this.shopItemRepository.remove(shopItem);
  }
}