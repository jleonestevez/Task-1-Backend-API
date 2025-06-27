import { ShopItemCategory } from '../shop-item-categories/shop-item-category.entity';
import { OrderItem } from '../orders/order-item.entity';
export declare class ShopItem {
    id: number;
    title: string;
    description: string;
    price: number;
    categories: ShopItemCategory[];
    orderItems: OrderItem[];
}
