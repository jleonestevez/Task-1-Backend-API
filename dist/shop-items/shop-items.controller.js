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
exports.ShopItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shop_items_service_1 = require("./shop-items.service");
const create_shop_item_dto_1 = require("./dto/create-shop-item.dto");
const update_shop_item_dto_1 = require("./dto/update-shop-item.dto");
const shop_item_entity_1 = require("./shop-item.entity");
let ShopItemsController = class ShopItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    create(dto) {
        return this.itemsService.create(dto);
    }
    findAll() {
        return this.itemsService.findAll();
    }
    findOne(id) {
        return this.itemsService.findOne(Number(id));
    }
    update(id, dto) {
        return this.itemsService.update(Number(id), dto);
    }
    remove(id) {
        return this.itemsService.remove(Number(id));
    }
};
exports.ShopItemsController = ShopItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ type: shop_item_entity_1.ShopItem }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shop_item_dto_1.CreateShopItemDto]),
    __metadata("design:returntype", Promise)
], ShopItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ type: [shop_item_entity_1.ShopItem] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({ type: shop_item_entity_1.ShopItem }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOkResponse)({ type: shop_item_entity_1.ShopItem }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_shop_item_dto_1.UpdateShopItemDto]),
    __metadata("design:returntype", Promise)
], ShopItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopItemsController.prototype, "remove", null);
exports.ShopItemsController = ShopItemsController = __decorate([
    (0, swagger_1.ApiTags)('shop-items'),
    (0, common_1.Controller)('shop-items'),
    __metadata("design:paramtypes", [shop_items_service_1.ShopItemsService])
], ShopItemsController);
//# sourceMappingURL=shop-items.controller.js.map