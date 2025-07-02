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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("./public.decorator");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            let errorMessage = 'Token de acceso requerido';
            if (!authHeader) {
                errorMessage = 'Header Authorization faltante. Incluye: Authorization: Bearer <token>';
            }
            else if (!authHeader.startsWith('Bearer ')) {
                errorMessage = 'Formato de Authorization incorrecto. Debe ser: Bearer <token>';
            }
            else if (info?.name === 'TokenExpiredError') {
                errorMessage = 'Token expirado. Haz login nuevamente.';
            }
            else if (info?.name === 'JsonWebTokenError') {
                errorMessage = 'Token inválido o malformado.';
            }
            else if (info?.message) {
                errorMessage = `Error de autenticación: ${info.message}`;
            }
            throw new common_1.UnauthorizedException(errorMessage);
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map