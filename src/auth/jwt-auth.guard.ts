import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      let errorMessage = 'Token de acceso requerido';
      
      if (!authHeader) {
        errorMessage = 'Header Authorization faltante. Incluye: Authorization: Bearer <token>';
      } else if (!authHeader.startsWith('Bearer ')) {
        errorMessage = 'Formato de Authorization incorrecto. Debe ser: Bearer <token>';
      } else if (info?.name === 'TokenExpiredError') {
        errorMessage = 'Token expirado. Haz login nuevamente.';
      } else if (info?.name === 'JsonWebTokenError') {
        errorMessage = 'Token inválido o malformado.';
      } else if (info?.message) {
        errorMessage = `Error de autenticación: ${info.message}`;
      }

      throw new UnauthorizedException(errorMessage);
    }
    return user;
  }
} 