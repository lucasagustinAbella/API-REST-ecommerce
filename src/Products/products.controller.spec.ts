import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UpdateProductDto } from '../dtos/UpdateProducts.dto';
import { RolesGuard } from '../guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

describe('UseController', () => {
  let controller: ProductsController;
  let mockGuard: Partial<RolesGuard> = {
    canActivate: (
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> =>
      Promise.resolve(true),
  };

  let mockIdProduct: string = 'dcb7265c-b2ff-47b7-bbc7-98d67a1649e1';

  const mockProduct: Partial<UpdateProductDto> = {
    name: 'Updated Product Name',
  };

  let mockProductsService: Partial<ProductsService> = {
    updateProduct: (mockIdProduct: string, updateProduct: UpdateProductDto) =>
      Promise.resolve(mockIdProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        JwtService,
        { provide: RolesGuard, useValue: mockGuard },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProduct', () => {
    it('Should return product.id for an update product', async () => {
      const productId = mockIdProduct;
      const updateProduct = mockProduct;
      const result = await controller.updateProduct(productId, updateProduct);
      expect(result).toBe(mockIdProduct);
    });
  });
});
