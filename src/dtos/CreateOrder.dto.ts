import { IsNotEmpty, IsUUID, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Products } from '../entities/products.entity';

export class CreateOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: [
      {
        id: '',
      },
      {
        id: '',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  products: Partial<Products[]>;
}
