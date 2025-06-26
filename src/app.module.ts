import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ShopItemCategoriesModule } from './shop-item-categories/shop-item-categories.module';
import { ShopItemsModule } from './shop-items/shop-items.module';
import { OrdersModule } from './orders/orders.module';
import { User } from './users/entities/user.entity';
import { Customer } from './customers/entities/customer.entity';
import { ShopItemCategory } from './shop-item-categories/entities/shop-item-category.entity';
import { ShopItem } from './shop-items/entities/shop-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH', './database.sqlite'),
        entities: [User, Customer, ShopItemCategory, ShopItem, Order, OrderItem],
        synchronize: true, // Set to false in production
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    ShopItemCategoriesModule,
    ShopItemsModule,
    OrdersModule,
  ],
})
export class AppModule {}