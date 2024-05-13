import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../Users/users.service';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersrepository: Partial<Repository<Users>>;

  let mockId: string = '7fd4ecf4-2489-4d49-aaf6-6a0e327a452d';
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

  beforeEach(async () => {
    mockUsersrepository = {
      findOne: async (options) => {
        const where: any = options.where;
        if (where && where.id === mockUser.id) {
          return mockUser;
        }
        return undefined;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUsersrepository = module.get<Repository<Users>>(
      getRepositoryToken(Users),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return status 404', async () => {
      await expect(service.getUserById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
