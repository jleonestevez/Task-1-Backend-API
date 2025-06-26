import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: Repository<Customer>;

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCustomerDto: CreateCustomerDto = {
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create a new customer successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null); // No existing customer
      mockRepository.create.mockReturnValue(mockCustomer);
      mockRepository.save.mockResolvedValue(mockCustomer);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createCustomerDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createCustomerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createCustomerDto.password, 12);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCustomerDto,
        password: 'hashedPassword',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw ConflictException if customer already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        new ConflictException('Customer with this email already exists'),
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers = [mockCustomer];
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([customers, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        select: ['id', 'name', 'surname', 'email', 'isActive', 'createdAt', 'updatedAt'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: customers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly', async () => {
      const customers = [mockCustomer];
      const total = 25;
      mockRepository.findAndCount.mockResolvedValue([customers, total]);

      const result = await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        select: ['id', 'name', 'surname', 'email', 'isActive', 'createdAt', 'updatedAt'],
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
    it('should return a customer by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'name', 'surname', 'email', 'isActive', 'createdAt', 'updatedAt'],
        relations: ['orders'],
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Customer with ID 999 not found'),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a customer by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findByEmail('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if customer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateCustomerDto: UpdateCustomerDto = {
      name: 'Jane',
      surname: 'Smith',
    };

    it('should update a customer successfully', async () => {
      const updatedCustomer = { ...mockCustomer, ...updateCustomerDto };
      mockRepository.findOne
        .mockResolvedValueOnce(mockCustomer) // findOne in update method
        .mockResolvedValueOnce(updatedCustomer); // findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateCustomerDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateCustomerDto);
      expect(result).toEqual(updatedCustomer);
    });

    it('should hash password when updating password', async () => {
      const updateWithPassword: UpdateCustomerDto = {
        password: 'newPassword123',
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as never);
      mockRepository.findOne
        .mockResolvedValueOnce(mockCustomer)
        .mockResolvedValueOnce(mockCustomer);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update(1, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 12);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        password: 'newHashedPassword',
      });
    });

    it('should check email uniqueness when updating email', async () => {
      const updateWithEmail: UpdateCustomerDto = {
        email: 'new@example.com',
      };
      mockRepository.findOne
        .mockResolvedValueOnce(mockCustomer) // findOne in update method
        .mockResolvedValueOnce(null) // email uniqueness check
        .mockResolvedValueOnce(mockCustomer); // findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update(1, updateWithEmail);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'new@example.com' },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateWithEmail: UpdateCustomerDto = {
        email: 'existing@example.com',
      };
      const existingCustomer = { ...mockCustomer, id: 2, email: 'existing@example.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockCustomer)
        .mockResolvedValueOnce(existingCustomer);

      await expect(service.update(1, updateWithEmail)).rejects.toThrow(
        new ConflictException('Customer with this email already exists'),
      );
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateCustomerDto)).rejects.toThrow(
        new NotFoundException('Customer with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a customer successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);
      mockRepository.remove.mockResolvedValue(mockCustomer);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'name', 'surname', 'email', 'isActive', 'createdAt', 'updatedAt'],
        relations: ['orders'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCustomer);
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Customer with ID 999 not found'),
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});