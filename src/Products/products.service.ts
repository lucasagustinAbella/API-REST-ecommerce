import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Products } from '../entities/products.entity';
import { Categories } from '../entities/categories.entity';
import * as data from '../data.json';
import { UpdateProductDto } from '../dtos/UpdateProducts.dto';
import { CreateProductDto } from '../dtos/CreateProducts.dto';
import { Orders } from '../entities/orders.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Products[]> {
    const products = await this.productsRepository.find({
      where: { stock: MoreThan(0) },
      relations: {
        category: true,
      },
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    const productsSlice = products.slice(start, end);
    return productsSlice;
  }

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log(product.stock);

    return product;
  }

  async createProduct(product: CreateProductDto): Promise<string> {
    const categories = await this.categoriesRepository.find();

    const categoryFound = categories.find((category) => {
      return category.name === product.category;
    });

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    console.log(categoryFound);
    const newProduct = new Products();
    newProduct.category = categoryFound;
    newProduct.description = product.description;
    newProduct.imgUrl = product.imgUrl;
    newProduct.name = product.name;
    newProduct.price = product.price;
    newProduct.stock = product.stock;
    await this.productsRepository.save(newProduct);
    return newProduct.id;
  }

  async updateProduct(
    id: string,
    updateProduct: Partial<UpdateProductDto>,
  ): Promise<string> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.update(id, { ...updateProduct });
    return product.id;
  }

  async deleteProduct(id: string): Promise<string> {
    const UserFound = await this.productsRepository.findOne({ where: { id } });
    if (!UserFound) {
      throw new NotFoundException('User not found');
    }
    await this.productsRepository.delete(UserFound.id);
    return UserFound.id;
  }

  async addProducts() {
    const orders = await this.ordersRepository.find();

    if (orders.length) {
      throw new BadRequestException(
        'Orders already contain products. Seeder invalid',
      );
    }

    const categories = await this.categoriesRepository.find();

    data?.map(async (element) => {
      const category = categories.find(
        (category) => category.name === element.category,
      );
      if (!category) {
        throw new BadRequestException('Categories not found');
      }

      const product = new Products();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.stock = element.stock;
      product.imgUrl = element.imgUrl;
      product.category = category;
      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    });
    return 'Productos precargados';
  }
}
