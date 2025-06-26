import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CustomersService } from '../customers/customers.service';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | Customer | null> {
    // Try to find user first
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result as User;
    }

    // Try to find customer
    const customer = await this.customersService.findByEmail(email);
    if (customer && await bcrypt.compare(password, customer.password)) {
      const { password, ...result } = customer;
      return result as Customer;
    }
    
    return null;
  }

  async login(user: User | Customer) {
    const payload: JwtPayload = { 
      email: user.email, 
      sub: user.id 
    };
    
    const isUser = 'firstName' in user;
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        ...(isUser 
          ? { firstName: (user as User).firstName, lastName: (user as User).lastName }
          : { name: (user as Customer).name, surname: (user as Customer).surname }
        ),
        isActive: user.isActive,
        type: isUser ? 'user' : 'customer',
      },
    };
  }
}