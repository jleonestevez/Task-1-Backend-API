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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShopItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const create_shop_item_dto_1 = require("./create-shop-item.dto");
class UpdateShopItemDto extends (0, mapped_types_1.PartialType)(create_shop_item_dto_1.CreateShopItemDto) {
}
exports.UpdateShopItemDto = UpdateShopItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Laptop' }),
    __metadata("design:type", String)
], UpdateShopItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Portátil ultraligero' }),
    __metadata("design:type", String)
], UpdateShopItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 999.99 }),
    __metadata("design:type", Number)
], UpdateShopItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [1, 2] }),
    __metadata("design:type", Array)
], UpdateShopItemDto.prototype, "categoryIds", void 0);
//# sourceMappingURL=update-shop-item.dto.js.map