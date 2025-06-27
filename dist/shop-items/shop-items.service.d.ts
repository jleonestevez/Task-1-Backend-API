import { Repository } from 'typeorm';
import { ShopItem } from './shop-item.entity';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItemCategory } from '../shop-item-categories/shop-item-category.entity';
export declare class ShopItemsService {
    private readonly itemsRepository;
    private readonly categoriesRepository;
    constructor(itemsRepository: Repository<ShopItem>, categoriesRepository: Repository<ShopItemCategory>);
    create(dto: CreateShopItemDto): Promise<ShopItem>;
    findAll(): Promise<ShopItem[]>;
    findOne(id: number): Promise<ShopItem>;
    update(id: number, dto: UpdateShopItemDto): Promise<ShopItem>;
    remove(id: number): Promise<void>;
}
