import { Customer } from '../customers/customer.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    customer: Customer;
    items: OrderItem[];
}
