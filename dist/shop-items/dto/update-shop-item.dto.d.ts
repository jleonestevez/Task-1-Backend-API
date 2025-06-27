import { CreateShopItemDto } from './create-shop-item.dto';
declare const UpdateShopItemDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateShopItemDto>>;
export declare class UpdateShopItemDto extends UpdateShopItemDto_base {
    title?: string;
    description?: string;
    price?: number;
    categoryIds?: number[];
}
export {};
