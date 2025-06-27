"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopItemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shop_item_entity_1 = require("./shop-item.entity");
const shop_items_service_1 = require("./shop-items.service");
const shop_items_controller_1 = require("./shop-items.controller");
const shop_item_category_entity_1 = require("../shop-item-categories/shop-item-category.entity");
let ShopItemsModule = class ShopItemsModule {
};
exports.ShopItemsModule = ShopItemsModule;
exports.ShopItemsModule = ShopItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([shop_item_entity_1.ShopItem, shop_item_category_entity_1.ShopItemCategory])],
        controllers: [shop_items_controller_1.ShopItemsController],
        providers: [shop_items_service_1.ShopItemsService],
        exports: [shop_items_service_1.ShopItemsService],
    })
], ShopItemsModule);
//# sourceMappingURL=shop-items.module.js.map