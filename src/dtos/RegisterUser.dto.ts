import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './CreateUser.dto';
import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDtO extends PickType(CreateUserDto, [
  'name',
  'address',
  'phone',
  'country',
  'city',
  'email',
  'password',
]) {
  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Password123!' })
  confirmPassword: string;
}
