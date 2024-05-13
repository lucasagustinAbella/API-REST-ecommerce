import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDtO } from 'src/dtos/RegisterUser.dto';
import { Users } from 'src/entities/users.entity';
import { LoginUserDto } from 'src/dtos/LoginUser.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  const mockRegisterUser: RegisterUserDtO = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    address: '123 Test St',
    phone: 1234567890,
    country: 'Test Country',
    city: 'Test City',
    confirmPassword: 'TestPassword123!',
  };
  const mockUser: Users = {
    id: '7fd4ecf4-2489-4d49-aaf6-6a0e327a452d',
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    address: '123 Test St',
    phone: 1234567890,
    isAdmin: false,
    country: 'Test Country',
    city: 'Test City',
    orders: [],
  };
  const mockCredentials: LoginUserDto = {
    email: 'test@example.com',
    password: 'WrongPassword',
  };

  beforeEach(async () => {
    mockAuthService = {
      registerAuth: () => Promise.resolve(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //

  describe('signup', () => {
    it('should register a new user when given valid input', async () => {
      const registerUser = await controller.registerAuth(mockRegisterUser);
      expect(registerUser).toBeDefined();
      expect(registerUser.name).toEqual(mockRegisterUser.name);
    });
  });
});
