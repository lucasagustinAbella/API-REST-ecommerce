import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { UsersModule } from './Users/users.module';
import { ProductsModule } from './Products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './Orders/orders.module';
import { CategoriesModule } from './Categories/categories.module';
import { FilesModule } from './Files/files.module';
import typeOrmConfig from './config/databaseConfig';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesService } from './Categories/categories.service';
import { ProductsService } from './Products/products.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    FilesModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.categoriesService.addCategories();

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    await this.productsService.addProducts();
  }
}
