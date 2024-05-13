import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from '../entities/orderdetails.entity';
import { Orders } from '../entities/orders.entity';
import { Products } from '../entities/products.entity';
import { Users } from '../entities/users.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private producsRepository: Repository<Products>,
  ) {}

  getOrder(id: string) {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: { products: true },
      },
    });
    if (!order) {
      return 'Order Not Found';
    }
    return order;
  }

  async addOrder(
    userId: string,
    products: Products[],
  ): Promise<Partial<OrderDetails>> {
    let total = 0;
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderDate = new Date();

    const productsArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.producsRepository.findOne({
          where: { id: element.id, stock: MoreThan(0) },
        });

        if (!product) {
          throw new NotFoundException('Product Not found');
        }
        total += Number(product.price);
        product.stock = product.stock - 1;
        await this.producsRepository.save(product);
        return product;
      }),
    );

    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.products = productsArray;
    await this.orderDetailsRepository.save(orderDetail);

    const newOrder = new Orders();
    newOrder.user = user;
    newOrder.date = orderDate;
    newOrder.orderDetails = orderDetail;

    await this.ordersRepository.save(newOrder);

    const { id, price } = orderDetail;
    return { id, price };
  }
}
