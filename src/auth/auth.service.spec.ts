import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CustomersService } from '../customers/customers.service';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let customersService: CustomersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomer: Customer = {
    id: 1,
    name: 'Jane',
    surname: 'Smith',
    email: 'customer@example.com',
    password: 'hashedPassword',
    isActive: true,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockCustomersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    customersService = module.get<CustomersService>(CustomersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should validate and return user when credentials are correct', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should validate and return customer when user not found but customer exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockCustomersService.findByEmail.mockResolvedValue(mockCustomer);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockCustomersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockCustomer.password);
      expect(result).toEqual({
        id: mockCustomer.id,
        name: mockCustomer.name,
        surname: mockCustomer.surname,
        email: mockCustomer.email,
        isActive: mockCustomer.isActive,
        orders: mockCustomer.orders,
        createdAt: mockCustomer.createdAt,
        updatedAt: mockCustomer.updatedAt,
      });
    });

    it('should return null when user exists but password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(mockCustomersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null when customer exists but password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockCustomersService.findByEmail.mockResolvedValue(mockCustomer);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockCustomersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockCustomer.password);
      expect(result).toBeNull();
    });

    it('should return null when neither user nor customer exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockCustomersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockCustomersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const mockToken = 'jwt-token';

    beforeEach(() => {
      mockJwtService.sign.mockReturnValue(mockToken);
    });

    it('should generate token and return user data for user', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      const result = await service.login(userWithoutPassword as User);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          isActive: mockUser.isActive,
          type: 'user',
        },
      });
    });

    it('should generate token and return customer data for customer', async () => {
      const customerWithoutPassword = {
        id: mockCustomer.id,
        name: mockCustomer.name,
        surname: mockCustomer.surname,
        email: mockCustomer.email,
        isActive: mockCustomer.isActive,
        orders: mockCustomer.orders,
        createdAt: mockCustomer.createdAt,
        updatedAt: mockCustomer.updatedAt,
      };

      const result = await service.login(customerWithoutPassword as Customer);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockCustomer.email,
        sub: mockCustomer.id,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockCustomer.id,
          email: mockCustomer.email,
          name: mockCustomer.name,
          surname: mockCustomer.surname,
          isActive: mockCustomer.isActive,
          type: 'customer',
        },
      });
    });
  });
});