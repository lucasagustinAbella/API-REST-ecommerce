import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { Categories } from '../entities/categories.entity';
import { Orders } from '../entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Categories, Orders])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
