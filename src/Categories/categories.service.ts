import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Repository } from 'typeorm';
import * as data from '../data.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async addCategories() {
    data?.map(async (element) => {
      await this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore(`("name") DO NOTHING`)
        .execute();
    });
    return 'Categories pre-loaded';
  }

  async getCategories(): Promise<Categories[]> {
    try {
      const categories = await this.categoriesRepository.find();
      return categories;
    } catch (err) {
      throw new NotFoundException('Categories not found');
    }
  }
}
