import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ShopItem } from '../shop-items/entities/shop-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let customerRepository: Repository<Customer>;
  let shopItemRepository: Repository<ShopItem>;

  const mockCustomer: Customer = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    isActive: true,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockShopItem: ShopItem = {
    id: 1,
    name: 'Laptop',
    description: 'Gaming laptop',
    price: 999.99,
    stock: 10,
    isActive: true,
    categories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderItem: OrderItem = {
    id: 1,
    order: null,
    shopItem: mockShopItem,
    quantity: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrder: Order = {
    id: 1,
    customer: mockCustomer,
    items: [mockOrderItem],
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
  };

  const mockShopItemRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(ShopItem),
          useValue: mockShopItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    shopItemRepository = module.get<Repository<ShopItem>>(getRepositoryToken(ShopItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      customerId: 1,
      items: [
        {
          shopItemId: 1,
          quantity: 2,
        },
      ],
    };

    it('should create a new order successfully', async () => {
      const orderWithoutItems = { ...mockOrder, items: [] };
      
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockOrderRepository.create.mockReturnValue(orderWithoutItems);
      mockOrderRepository.save.mockResolvedValue(orderWithoutItems);
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockOrderItemRepository.create.mockReturnValue(mockOrderItem);
      mockOrderItemRepository.save.mockResolvedValue([mockOrderItem]);
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createOrderDto.customerId },
      });
      expect(mockOrderRepository.create).toHaveBeenCalledWith({ customer: mockCustomer });
      expect(mockShopItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: createOrderDto.items[0].shopItemId },
      });
      expect(mockOrderItemRepository.create).toHaveBeenCalledWith({
        order: orderWithoutItems,
        shopItem: mockShopItem,
        quantity: createOrderDto.items[0].quantity,
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        new NotFoundException('Customer with ID 1 not found'),
      );
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if shop item not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockShopItemRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        new NotFoundException('Shop item with ID 1 not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const orders = [mockOrder];
      const total = 1;
      mockOrderRepository.findAndCount.mockResolvedValue([orders, total]);

      const result = await service.findAll(1, 10);

      expect(mockOrderRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['customer', 'items', 'items.shopItem'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: orders,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly', async () => {
      const orders = [mockOrder];
      const total = 25;
      mockOrderRepository.findAndCount.mockResolvedValue([orders, total]);

      const result = await service.findAll(2, 10);

      expect(mockOrderRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['customer', 'items', 'items.shopItem'],
        skip: 10,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['customer', 'items', 'items.shopItem'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    const updateOrderDto: UpdateOrderDto = {
      customerId: 2,
      items: [
        {
          shopItemId: 1,
          quantity: 3,
        },
      ],
    };

    it('should update an order successfully', async () => {
      const newCustomer = { ...mockCustomer, id: 2 };
      const updatedOrder = { ...mockOrder, customer: newCustomer };
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockCustomerRepository.findOne.mockResolvedValue(newCustomer);
      mockOrderItemRepository.delete.mockResolvedValue({ affected: 1 });
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockOrderItemRepository.create.mockReturnValue(mockOrderItem);
      mockOrderItemRepository.save.mockResolvedValue([mockOrderItem]);
      mockOrderRepository.save.mockResolvedValue(updatedOrder);

      jest.spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockOrder) // First call in update method
        .mockResolvedValueOnce(updatedOrder); // Final call

      const result = await service.update(1, updateOrderDto);

      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({
        where: { id: updateOrderDto.customerId },
      });
      expect(mockOrderItemRepository.delete).toHaveBeenCalledWith({ order: { id: 1 } });
      expect(mockShopItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: updateOrderDto.items[0].shopItemId },
      });
      expect(result).toEqual(updatedOrder);
    });

    it('should update order without changing items', async () => {
      const updateWithoutItems = { customerId: 2 };
      const newCustomer = { ...mockCustomer, id: 2 };
      const updatedOrder = { ...mockOrder, customer: newCustomer };
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockCustomerRepository.findOne.mockResolvedValue(newCustomer);
      mockOrderRepository.save.mockResolvedValue(updatedOrder);

      jest.spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(updatedOrder);

      const result = await service.update(1, updateWithoutItems);

      expect(mockOrderItemRepository.delete).not.toHaveBeenCalled();
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateOrderDto)).rejects.toThrow(
        new NotFoundException('Customer with ID 2 not found'),
      );
    });

    it('should throw NotFoundException if shop item not found', async () => {
      const newCustomer = { ...mockCustomer, id: 2 };
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockCustomerRepository.findOne.mockResolvedValue(newCustomer);
      mockOrderItemRepository.delete.mockResolvedValue({ affected: 1 });
      mockShopItemRepository.findOne.mockResolvedValue(null);

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockOrder);

      await expect(service.update(1, updateOrderDto)).rejects.toThrow(
        new NotFoundException('Shop item with ID 1 not found'),
      );
    });

    it('should throw NotFoundException if order does not exist', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateOrderDto)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.remove.mockResolvedValue(mockOrder);

      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrder);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.remove).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Order with ID 999 not found'),
      );

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found'),
      );
      expect(mockOrderRepository.remove).not.toHaveBeenCalled();
    });
  });
});