import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ShopItem } from '../shop-items/entities/shop-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(ShopItem)
    private readonly shopItemRepository: Repository<ShopItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items } = createOrderDto;

    // Verify customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Create order
    const order = this.orderRepository.create({ customer });
    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = [];
    for (const itemDto of items) {
      const shopItem = await this.shopItemRepository.findOne({
        where: { id: itemDto.shopItemId },
      });
      if (!shopItem) {
        throw new NotFoundException(`Shop item with ID ${itemDto.shopItemId} not found`);
      }

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        shopItem,
        quantity: itemDto.quantity,
      });
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);

    // Return order with items
    return this.findOne(savedOrder.id);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.orderRepository.findAndCount({
      relations: ['customer', 'items', 'items.shopItem'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.shopItem'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const { customerId, items } = updateOrderDto;

    // Update customer if provided
    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
      order.customer = customer;
    }

    // Update items if provided
    if (items) {
      // Remove existing order items
      await this.orderItemRepository.delete({ order: { id } });

      // Create new order items
      const orderItems = [];
      for (const itemDto of items) {
        const shopItem = await this.shopItemRepository.findOne({
          where: { id: itemDto.shopItemId },
        });
        if (!shopItem) {
          throw new NotFoundException(`Shop item with ID ${itemDto.shopItemId} not found`);
        }

        const orderItem = this.orderItemRepository.create({
          order,
          shopItem,
          quantity: itemDto.quantity,
        });
        orderItems.push(orderItem);
      }

      await this.orderItemRepository.save(orderItems);
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}