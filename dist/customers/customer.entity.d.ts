import { Order } from '../orders/order.entity';
export declare class Customer {
    id: number;
    name: string;
    surname: string;
    email: string;
    orders: Order[];
}
