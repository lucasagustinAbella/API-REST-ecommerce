import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDtO } from '../dtos/RegisterUser.dto';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { UsersService } from '../Users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  getAuth() {
    return 'Authentication';
  }

  async loginAuth(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    } else {
      const userPayload = {
        sub: user.id,
        id: user.id,
        email: user.email,
        roles: [user.isAdmin ? Role.Admin : Role.User],
      };

      const token = this.jwtService.sign(userPayload);
      return { success: 'User logged', token };
    }
  }

  async registerAuth(registerAuth: RegisterUserDtO): Promise<Users> {
    const user = await this.userService.getUserByEmail(registerAuth.email);

    if (user) {
      throw new BadRequestException('Email already exist in DB');
    }
    if (registerAuth.password !== registerAuth.confirmPassword) {
      throw new BadRequestException('Passwords dont match');
    }
    const hashedPassword = await bcrypt.hash(registerAuth.password, 10);
    await this.usersRepository.save({
      ...registerAuth,
      password: hashedPassword,
    });

    const newUser = await this.usersRepository.findOne({
      where: { email: registerAuth.email },
      select: [
        'name',
        'address',
        'phone',
        'country',
        'city',
        'email',
        'birthday',
      ],
    });
    return newUser;
  }
}
