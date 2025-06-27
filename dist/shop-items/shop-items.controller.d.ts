import { ShopItemsService } from './shop-items.service';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';
import { ShopItem } from './shop-item.entity';
export declare class ShopItemsController {
    private readonly itemsService;
    constructor(itemsService: ShopItemsService);
    create(dto: CreateShopItemDto): Promise<ShopItem>;
    findAll(): Promise<ShopItem[]>;
    findOne(id: string): Promise<ShopItem>;
    update(id: string, dto: UpdateShopItemDto): Promise<ShopItem>;
    remove(id: string): Promise<void>;
}
