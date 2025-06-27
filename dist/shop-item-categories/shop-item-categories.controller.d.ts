import { ShopItemCategoriesService } from './shop-item-categories.service';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';
import { ShopItemCategory } from './shop-item-category.entity';
export declare class ShopItemCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: ShopItemCategoriesService);
    create(dto: CreateShopItemCategoryDto): Promise<ShopItemCategory>;
    findAll(): Promise<ShopItemCategory[]>;
    findOne(id: string): Promise<ShopItemCategory>;
    update(id: string, dto: UpdateShopItemCategoryDto): Promise<ShopItemCategory>;
    remove(id: string): Promise<void>;
}
