"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shop_item_entity_1 = require("./shop-item.entity");
const shop_item_category_entity_1 = require("../shop-item-categories/shop-item-category.entity");
let ShopItemsService = class ShopItemsService {
    constructor(itemsRepository, categoriesRepository) {
        this.itemsRepository = itemsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(dto) {
        const item = this.itemsRepository.create({
            title: dto.title,
            description: dto.description,
            price: dto.price,
        });
        if (dto.categoryIds?.length) {
            const categories = await this.categoriesRepository.findByIds(dto.categoryIds);
            item.categories = categories;
        }
        return this.itemsRepository.save(item);
    }
    findAll() {
        return this.itemsRepository.find({ relations: ['categories'] });
    }
    async findOne(id) {
        const item = await this.itemsRepository.findOne({ where: { id }, relations: ['categories'] });
        if (!item)
            throw new common_1.NotFoundException(`Item #${id} not found`);
        return item;
    }
    async update(id, dto) {
        const item = await this.findOne(id);
        Object.assign(item, dto);
        if (dto.categoryIds) {
            const categories = await this.categoriesRepository.findByIds(dto.categoryIds);
            item.categories = categories;
        }
        return this.itemsRepository.save(item);
    }
    async remove(id) {
        const item = await this.findOne(id);
        await this.itemsRepository.remove(item);
    }
};
exports.ShopItemsService = ShopItemsService;
exports.ShopItemsService = ShopItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shop_item_entity_1.ShopItem)),
    __param(1, (0, typeorm_1.InjectRepository)(shop_item_category_entity_1.ShopItemCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShopItemsService);
//# sourceMappingURL=shop-items.service.js.map