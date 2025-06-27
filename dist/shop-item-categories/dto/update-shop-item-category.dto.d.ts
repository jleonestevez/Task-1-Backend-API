import { CreateShopItemCategoryDto } from './create-shop-item-category.dto';
declare const UpdateShopItemCategoryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateShopItemCategoryDto>>;
export declare class UpdateShopItemCategoryDto extends UpdateShopItemCategoryDto_base {
    title?: string;
    description?: string;
}
export {};
