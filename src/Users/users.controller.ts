import {
  Controller,
  Delete,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  HttpCode,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { AuthGuard } from '../guards/auth.guard';
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @Roles(Role.Admin)
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return await this.usersService.getUsers(page, limit);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiBody({ type: PartialType(CreateUserDto) })
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: Partial<CreateUserDto>,
  ) {
    return await this.usersService.updateUser(id, updateUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
