import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature modules
import { CustomersModule } from './customers/customers.module';
import { ShopItemCategoriesModule } from './shop-item-categories/shop-item-categories.module';
import { ShopItemsModule } from './shop-items/shop-items.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // synchronize should be disabled in production
      synchronize: true,
      autoLoadEntities: true,
    }),
    CustomersModule,
    ShopItemCategoriesModule,
    ShopItemsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
