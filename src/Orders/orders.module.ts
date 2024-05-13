import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { Orders } from '../entities/orders.entity';
import { Users } from '../entities/users.entity';
import { OrderDetails } from '../entities/orderdetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Users, Orders, OrderDetails])], // mismo forFeature???
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
