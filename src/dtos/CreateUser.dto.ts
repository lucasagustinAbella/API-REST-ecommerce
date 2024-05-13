import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(80, { message: 'Name must not exceed 80 characters' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
  )
  password: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @MinLength(3, { message: 'Address must be at least 3 characters long' })
  @MaxLength(80, { message: 'Address must not exceed 80 characters' })
  address: string;

  @ApiProperty({ example: 1234567890 })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber({}, { message: 'Phone number must be a number' })
  phone: number;

  @ApiProperty({ example: 'United States' })
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  @MinLength(5, { message: 'Country must be at least 5 characters long' })
  @MaxLength(20, { message: 'Country must not exceed 20 characters' })
  country: string;

  @ApiProperty({ example: 'New York' })
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  @MinLength(5, { message: 'City must be at least 5 characters long' })
  @MaxLength(20, { message: 'City must not exceed 20 characters' })
  city: string;
}
