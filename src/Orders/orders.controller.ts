import {
  Controller,
  Post,
  Body,
  Get,
  ParseUUIDPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  addOrder(@Body() orderData: CreateOrderDto) {
    const { userId, products } = orderData;
    return this.ordersService.addOrder(userId, products);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
}
