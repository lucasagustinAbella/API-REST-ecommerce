import { Controller, Get } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('seeder')
  async addCategories() {
    return await this.categoriesService.addCategories();
  }

  @Get()
  async getCategories(): Promise<Categories[]> {
    return await this.categoriesService.getCategories();
  }
}
