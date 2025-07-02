import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }
} 