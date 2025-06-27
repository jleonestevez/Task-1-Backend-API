import { ShopItem } from '../shop-items/shop-item.entity';
import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    shopItem: ShopItem;
    quantity: number;
    order: Order;
}
