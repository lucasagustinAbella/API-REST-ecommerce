import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDtO } from '../dtos/RegisterUser.dto';
import { Users } from '../entities/users.entity';
import { UsersService } from '../Users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: RegisterUserDtO = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    address: '123 Test St',
    phone: 1234567890,
    country: 'Test Country',
    city: 'Test City',
    confirmPassword: 'TestPassword123!',
  };
  const mockExistingUser: Users = {
    id: '123s-1asd3-4352xc-123',
    name: 'Existing User',
    email: 'existing@example.com',
    password: 'ExistingPassword123!',
    address: '123 Existing St',
    phone: 9876543210,
    country: 'Existing Country',
    city: 'Existing City',
    isAdmin: false,
    orders: [],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        { provide: getRepositoryToken(Users), useClass: Repository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Create an instance of AuthService', () => {
    expect(authService).toBeDefined();
  });

  describe('registerAuth', () => {
    it('should throw BadRequestException if the email already exists', async () => {
      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValue(mockExistingUser);

      await expect(async () => {
        await authService.registerAuth(mockUser);
      }).rejects.toThrow('Email already exist in DB');
    });

    it('should throw BadRequestException if the passwords do not match', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
      const modifiedUser = {
        ...mockUser,
        confirmPassword: 'MismatchedPassword',
      };

      await expect(authService.registerAuth(modifiedUser)).rejects.toThrow(
        'Passwords dont match',
      );
    });
  });
});
