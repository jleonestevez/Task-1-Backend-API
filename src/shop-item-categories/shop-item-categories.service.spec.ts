import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShopItemCategoriesService } from './shop-item-categories.service';
import { ShopItemCategory } from './entities/shop-item-category.entity';
import { CreateShopItemCategoryDto } from './dto/create-shop-item-category.dto';
import { UpdateShopItemCategoryDto } from './dto/update-shop-item-category.dto';

describe('ShopItemCategoriesService', () => {
  let service: ShopItemCategoriesService;
  let repository: Repository<ShopItemCategory>;

  const mockCategory: ShopItemCategory = {
    id: 1,
    name: 'Electronics',
    description: 'Electronic items',
    shopItems: [],
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
        ShopItemCategoriesService,
        {
          provide: getRepositoryToken(ShopItemCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShopItemCategoriesService>(ShopItemCategoriesService);
    repository = module.get<Repository<ShopItemCategory>>(getRepositoryToken(ShopItemCategory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCategoryDto: CreateShopItemCategoryDto = {
      name: 'Electronics',
      description: 'Electronic items',
    };

    it('should create a new category successfully', async () => {
      mockRepository.create.mockReturnValue(mockCategory);
      mockRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      const categories = [mockCategory];
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([categories, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['shopItems'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: categories,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly', async () => {
      const categories = [mockCategory];
      const total = 25;
      mockRepository.findAndCount.mockResolvedValue([categories, total]);

      const result = await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['shopItems'],
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
    it('should return a category by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['shopItems'],
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Shop item category with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateShopItemCategoryDto = {
      name: 'Updated Electronics',
      description: 'Updated electronic items',
    };

    it('should update a category successfully', async () => {
      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockRepository.findOne
        .mockResolvedValueOnce(mockCategory) // findOne in update method
        .mockResolvedValueOnce(updatedCategory); // findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateCategoryDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['shopItems'],
      });
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateCategoryDto)).rejects.toThrow(
        new NotFoundException('Shop item category with ID 999 not found'),
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);
      mockRepository.remove.mockResolvedValue(mockCategory);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['shopItems'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Shop item category with ID 999 not found'),
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});