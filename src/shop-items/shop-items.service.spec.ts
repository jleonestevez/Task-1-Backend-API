import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShopItemsService } from './shop-items.service';
import { ShopItem } from './entities/shop-item.entity';
import { ShopItemCategory } from '../shop-item-categories/entities/shop-item-category.entity';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';

describe('ShopItemsService', () => {
  let service: ShopItemsService;
  let shopItemRepository: Repository<ShopItem>;
  let categoryRepository: Repository<ShopItemCategory>;

  const mockCategory: ShopItemCategory = {
    id: 1,
    name: 'Electronics',
    description: 'Electronic items',
    shopItems: [],
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
    categories: [mockCategory],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockShopItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoryRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopItemsService,
        {
          provide: getRepositoryToken(ShopItem),
          useValue: mockShopItemRepository,
        },
        {
          provide: getRepositoryToken(ShopItemCategory),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ShopItemsService>(ShopItemsService);
    shopItemRepository = module.get<Repository<ShopItem>>(getRepositoryToken(ShopItem));
    categoryRepository = module.get<Repository<ShopItemCategory>>(getRepositoryToken(ShopItemCategory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createShopItemDto: CreateShopItemDto = {
      name: 'Laptop',
      description: 'Gaming laptop',
      price: 999.99,
      stock: 10,
      categoryIds: [1],
    };

    it('should create a new shop item successfully with categories', async () => {
      const { categoryIds, ...shopItemData } = createShopItemDto;
      mockShopItemRepository.create.mockReturnValue(mockShopItem);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockShopItemRepository.save.mockResolvedValue(mockShopItem);

      const result = await service.create(createShopItemDto);

      expect(mockShopItemRepository.create).toHaveBeenCalledWith(shopItemData);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { id: In(categoryIds) },
      });
      expect(mockShopItemRepository.save).toHaveBeenCalledWith(mockShopItem);
      expect(result).toEqual(mockShopItem);
    });

    it('should create a shop item without categories', async () => {
      const createWithoutCategories = { ...createShopItemDto };
      delete createWithoutCategories.categoryIds;
      
      mockShopItemRepository.create.mockReturnValue({ ...mockShopItem, categories: [] });
      mockShopItemRepository.save.mockResolvedValue({ ...mockShopItem, categories: [] });

      const result = await service.create(createWithoutCategories);

      expect(mockShopItemRepository.create).toHaveBeenCalledWith(createWithoutCategories);
      expect(mockCategoryRepository.find).not.toHaveBeenCalled();
      expect(result.categories).toEqual([]);
    });

    it('should throw NotFoundException if categories not found', async () => {
      mockShopItemRepository.create.mockReturnValue(mockShopItem);
      mockCategoryRepository.find.mockResolvedValue([]); // No categories found

      await expect(service.create(createShopItemDto)).rejects.toThrow(
        new NotFoundException('One or more categories not found'),
      );
      expect(mockShopItemRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated shop items', async () => {
      const shopItems = [mockShopItem];
      const total = 1;
      mockShopItemRepository.findAndCount.mockResolvedValue([shopItems, total]);

      const result = await service.findAll(1, 10);

      expect(mockShopItemRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['categories'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: shopItems,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly', async () => {
      const shopItems = [mockShopItem];
      const total = 25;
      mockShopItemRepository.findAndCount.mockResolvedValue([shopItems, total]);

      const result = await service.findAll(2, 10);

      expect(mockShopItemRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['categories'],
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
    it('should return a shop item by id', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);

      const result = await service.findOne(1);

      expect(mockShopItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });
      expect(result).toEqual(mockShopItem);
    });

    it('should throw NotFoundException if shop item not found', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Shop item with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    const updateShopItemDto: UpdateShopItemDto = {
      name: 'Updated Laptop',
      price: 1199.99,
      categoryIds: [1],
    };

    it('should update a shop item successfully', async () => {
      const { categoryIds, ...shopItemData } = updateShopItemDto;
      const updatedShopItem = { ...mockShopItem, ...shopItemData };
      
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockShopItemRepository.save.mockResolvedValue(updatedShopItem);

      const result = await service.update(1, updateShopItemDto);

      expect(mockShopItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { id: In(categoryIds) },
      });
      expect(mockShopItemRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedShopItem);
    });

    it('should update shop item without categories', async () => {
      const updateWithoutCategories = { name: 'Updated Laptop', price: 1199.99 };
      const updatedShopItem = { ...mockShopItem, ...updateWithoutCategories };
      
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockShopItemRepository.save.mockResolvedValue(updatedShopItem);

      const result = await service.update(1, updateWithoutCategories);

      expect(mockCategoryRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual(updatedShopItem);
    });

    it('should clear categories when empty array is provided', async () => {
      const updateWithEmptyCategories = { categoryIds: [] };
      const updatedShopItem = { ...mockShopItem, categories: [] };
      
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockShopItemRepository.save.mockResolvedValue(updatedShopItem);

      const result = await service.update(1, updateWithEmptyCategories);

      expect(mockCategoryRepository.find).not.toHaveBeenCalled();
      expect(result.categories).toEqual([]);
    });

    it('should throw NotFoundException if categories not found', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockCategoryRepository.find.mockResolvedValue([]); // No categories found

      await expect(service.update(1, updateShopItemDto)).rejects.toThrow(
        new NotFoundException('One or more categories not found'),
      );
    });

    it('should throw NotFoundException if shop item does not exist', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateShopItemDto)).rejects.toThrow(
        new NotFoundException('Shop item with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a shop item successfully', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(mockShopItem);
      mockShopItemRepository.remove.mockResolvedValue(mockShopItem);

      await service.remove(1);

      expect(mockShopItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });
      expect(mockShopItemRepository.remove).toHaveBeenCalledWith(mockShopItem);
    });

    it('should throw NotFoundException if shop item does not exist', async () => {
      mockShopItemRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Shop item with ID 999 not found'),
      );
      expect(mockShopItemRepository.remove).not.toHaveBeenCalled();
    });
  });
});