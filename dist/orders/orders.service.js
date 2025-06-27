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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const customer_entity_1 = require("../customers/customer.entity");
const shop_item_entity_1 = require("../shop-items/shop-item.entity");
const order_item_entity_1 = require("./order-item.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepository, customersRepository, itemsRepository) {
        this.ordersRepository = ordersRepository;
        this.customersRepository = customersRepository;
        this.itemsRepository = itemsRepository;
    }
    async create(dto) {
        const customer = await this.customersRepository.findOne({ where: { id: dto.customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const order = this.ordersRepository.create({ customer });
        const orderItems = [];
        for (const itemDto of dto.items) {
            const shopItem = await this.itemsRepository.findOne({ where: { id: itemDto.shopItemId } });
            if (!shopItem)
                throw new common_1.NotFoundException(`Shop item ${itemDto.shopItemId} not found`);
            const orderItem = new order_item_entity_1.OrderItem();
            orderItem.shopItem = shopItem;
            orderItem.quantity = itemDto.quantity;
            orderItems.push(orderItem);
        }
        order.items = orderItems;
        return this.ordersRepository.save(order);
    }
    findAll() {
        return this.ordersRepository.find();
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException(`Order #${id} not found`);
        return order;
    }
    async update(id, dto) {
        const order = await this.findOne(id);
        if (dto.items) {
            order.items = [];
            await this.ordersRepository.save(order);
            const newItems = [];
            for (const itemDto of dto.items) {
                const shopItem = await this.itemsRepository.findOne({ where: { id: itemDto.shopItemId } });
                if (!shopItem)
                    throw new common_1.NotFoundException(`Shop item ${itemDto.shopItemId} not found`);
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.shopItem = shopItem;
                orderItem.quantity = itemDto.quantity;
                newItems.push(orderItem);
            }
            order.items = newItems;
        }
        return this.ordersRepository.save(order);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(2, (0, typeorm_1.InjectRepository)(shop_item_entity_1.ShopItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map