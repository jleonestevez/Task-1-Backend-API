import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({ description: 'The unique identifier of the customer' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the customer' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The surname of the customer' })
  @Column()
  surname: string;

  @ApiProperty({ description: 'The email address of the customer' })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ description: 'Whether the customer account is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'The date the customer was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date the customer was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'The orders made by this customer', type: () => [Order] })
  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}