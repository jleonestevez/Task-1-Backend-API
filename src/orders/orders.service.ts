import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Customer } from '../customers/customer.entity';
import { ShopItem } from '../shop-items/shop-item.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(ShopItem)
    private readonly itemsRepository: Repository<ShopItem>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const customer = await this.customersRepository.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const order = this.ordersRepository.create({ customer });

    const orderItems: OrderItem[] = [];
    for (const itemDto of dto.items) {
      const shopItem = await this.itemsRepository.findOne({ where: { id: itemDto.shopItemId } });
      if (!shopItem) throw new NotFoundException(`Shop item ${itemDto.shopItemId} not found`);

      const orderItem = new OrderItem();
      orderItem.shopItem = shopItem;
      orderItem.quantity = itemDto.quantity;
      orderItems.push(orderItem);
    }
    order.items = orderItems;

    return this.ordersRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    // currently, only allow updating items list or nothing; for simplicity, not implemented fully
    if (dto.items) {
      // remove existing items
      order.items = [];
      await this.ordersRepository.save(order);

      const newItems: OrderItem[] = [];
      for (const itemDto of dto.items) {
        const shopItem = await this.itemsRepository.findOne({ where: { id: itemDto.shopItemId } });
        if (!shopItem) throw new NotFoundException(`Shop item ${itemDto.shopItemId} not found`);
        const orderItem = new OrderItem();
        orderItem.shopItem = shopItem;
        orderItem.quantity = itemDto.quantity;
        newItems.push(orderItem);
      }
      order.items = newItems;
    }
    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
} 