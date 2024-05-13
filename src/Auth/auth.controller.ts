import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { RegisterUserDtO } from '../dtos/RegisterUser.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }

  @Post('signin')
  loginAuth(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.loginAuth(email, password);
  }

  @Post('signup')
  registerAuth(@Body() registerUser: RegisterUserDtO) {
    return this.authService.registerAuth(registerUser);
  }
}
