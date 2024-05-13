import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../guards/auth.guard';
import { Products } from '../entities/products.entity';
import { UpdateProductDto } from '../dtos/UpdateProducts.dto';
import { CreateProductDto } from '../dtos/CreateProducts.dto';
import { RolesGuard } from '../guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorators';
import { Role } from '../Auth/roles.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @HttpCode(200)
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<Products[]> {
    return await this.productsService.getProducts(page, limit);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiBody({ type: PartialType(UpdateProductDto) })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: Partial<UpdateProductDto>,
  ) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProduct(id);
  }

  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts();
  }

  @Get(':id')
  @HttpCode(200)
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Products> {
    return await this.productsService.getProductById(id);
  }
}
