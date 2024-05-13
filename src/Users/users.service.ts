import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Users[]> {
    const users = await this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'address',
        'phone',
        'country',
        'city',
        'isAdmin',
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
    if (!users) {
      throw new BadRequestException(
        'Request error. Review the provided data and try again',
      );
    }
    return users;
  }

  async getUserById(id: string): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['orders'],
      });
      if (!user) {
        throw new NotFoundException('User Not found');
      }
      return user;
    } catch (err) {
      throw new NotFoundException('User Not found');
    }
  }

  async updateUser(
    id: string,
    updateUser: Partial<CreateUserDto>,
  ): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id } });
    console.log(user);
    console.log(id);
    if (!user) {
      throw new NotFoundException('User not found for update');
    }
    try {
      await this.usersRepository.update(id, { ...updateUser });
      return user.id;
    } catch (err) {
      throw new BadRequestException('Fail to update the user');
    }
  }

  async deleteUser(id: string): Promise<string> {
    const UserFound = await this.usersRepository.findOne({ where: { id } });
    if (!UserFound) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(UserFound.id);
    return UserFound.id;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }
}
