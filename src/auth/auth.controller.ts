import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: {
    type: 'object',
    properties: {
      access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          email: { type: 'string', example: 'admin@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' }
        }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      admin: {
        summary: 'Admin user example',
        description: 'Example login for admin user',
        value: {
          email: 'admin@example.com',
          password: 'password123'
        }
      },
      user: {
        summary: 'Regular user example',
        description: 'Example login for regular user',
        value: {
          email: 'user@example.com',
          password: 'userpass123'
        }
      }
    }
  })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'newuser@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 409, description: 'User with email already exists' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      user: {
        summary: 'New user registration',
        description: 'Example for registering a new user',
        value: {
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'securePassword123'
        }
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}