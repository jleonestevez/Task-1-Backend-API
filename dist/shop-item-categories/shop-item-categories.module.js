"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopItemCategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shop_item_category_entity_1 = require("./shop-item-category.entity");
const shop_item_categories_service_1 = require("./shop-item-categories.service");
const shop_item_categories_controller_1 = require("./shop-item-categories.controller");
let ShopItemCategoriesModule = class ShopItemCategoriesModule {
};
exports.ShopItemCategoriesModule = ShopItemCategoriesModule;
exports.ShopItemCategoriesModule = ShopItemCategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([shop_item_category_entity_1.ShopItemCategory])],
        controllers: [shop_item_categories_controller_1.ShopItemCategoriesController],
        providers: [shop_item_categories_service_1.ShopItemCategoriesService],
        exports: [shop_item_categories_service_1.ShopItemCategoriesService],
    })
], ShopItemCategoriesModule);
//# sourceMappingURL=shop-item-categories.module.js.map