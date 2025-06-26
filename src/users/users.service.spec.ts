import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    isActive: true,
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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null); // No existing user
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [mockUser];
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([users, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly', async () => {
      const users = [mockUser];
      const total = 25;
      mockRepository.findAndCount.mockResolvedValue([users, total]);

      const result = await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
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
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // findOne in update method
        .mockResolvedValueOnce(updatedUser); // findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateUserDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should hash password when updating password', async () => {
      const updateWithPassword: UpdateUserDto = {
        password: 'newPassword123',
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as never);
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update(1, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 12);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        password: 'newHashedPassword',
      });
    });

    it('should check email uniqueness when updating email', async () => {
      const updateWithEmail: UpdateUserDto = {
        email: 'new@example.com',
      };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // findOne in update method
        .mockResolvedValueOnce(null) // email uniqueness check
        .mockResolvedValueOnce(mockUser); // findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update(1, updateWithEmail);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'new@example.com' },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateWithEmail: UpdateUserDto = {
        email: 'existing@example.com',
      };
      const existingUser = { ...mockUser, id: 2, email: 'existing@example.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingUser);

      await expect(service.update(1, updateWithEmail)).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});