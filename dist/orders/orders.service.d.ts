import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Customer } from '../customers/customer.entity';
import { ShopItem } from '../shop-items/shop-item.entity';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly customersRepository;
    private readonly itemsRepository;
    constructor(ordersRepository: Repository<Order>, customersRepository: Repository<Customer>, itemsRepository: Repository<ShopItem>);
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    update(id: number, dto: UpdateOrderDto): Promise<Order>;
    remove(id: number): Promise<void>;
}
