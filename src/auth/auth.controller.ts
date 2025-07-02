import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './public.decorator';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'demo' },
        password: { type: 'string', example: 'secret123' },
      },
    },
  })
  @ApiOkResponse({ description: 'JWT access token' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User profile information' })
  getProfile(@Request() req) {
    return {
      message: 'Autenticación exitosa',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }
} 