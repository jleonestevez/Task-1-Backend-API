import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ 
    description: 'The name of the customer',
    example: 'Juan' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'The surname of the customer',
    example: 'Pérez' 
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ 
    description: 'The email address of the customer',
    example: 'juan.perez@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'The password for the customer account',
    example: 'customerPass123',
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password: string;
}