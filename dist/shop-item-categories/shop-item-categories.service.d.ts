import { Repository } from 'typeorm';
import { ShopItemCategory } from './shop-item-category.entity';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';
export declare class ShopItemCategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: Repository<ShopItemCategory>);
    create(dto: CreateShopItemCategoryDto): Promise<ShopItemCategory>;
    findAll(): Promise<ShopItemCategory[]>;
    findOne(id: number): Promise<ShopItemCategory>;
    update(id: number, dto: UpdateShopItemCategoryDto): Promise<ShopItemCategory>;
    remove(id: number): Promise<void>;
}
