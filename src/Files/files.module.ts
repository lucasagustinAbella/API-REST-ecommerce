import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { CloudinaryConfig } from '../config/cloudinary';
import { FilesRepository } from './files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  providers: [FilesService, CloudinaryConfig, FilesRepository],
  controllers: [FilesController],
})
export class FilesModule {}
