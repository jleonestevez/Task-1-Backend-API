import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ada' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Lovelace' })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: 'ada@lovelace.dev' })
  @IsEmail()
  email: string;
} 