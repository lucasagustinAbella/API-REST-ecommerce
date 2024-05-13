import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard } from '../src/guards/auth.guard';
import { Observable } from 'rxjs';
import { RolesGuard } from '../src/guards/roles.guard';
import { Users } from '../src/entities/users.entity';
import { UsersService } from '../src/Users/users.service';
import { CreateUserDto } from '../src/dtos/CreateUser.dto';
import { ProductsService } from '../src/Products/products.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  class MockAuthGuard extends AuthGuard {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      return true;
    }
  }

  class MockRolesGuard extends RolesGuard {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      return true;
    }
  }
  const mockId: string = 'dc190176-2828-4432-a142-6024410cec74';
  const mockExistingUser: Users = {
    id: 'dc190176-2828-4432-a142-6024410cec76',
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
  const updateUsermock: Partial<CreateUserDto> = {
    name: 'fakename',
  };

  class MockUsersService extends UsersService {
    async updateUser(
      id: string,
      updateUser: Partial<CreateUserDto>,
    ): Promise<string> {
      const user = await this.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.assign(user, updateUser);
      return user.id;
    }
    async getUserById(id: string): Promise<Users> {
      if (id === mockExistingUser.id) {
        return mockExistingUser;
      } else {
        throw new NotFoundException('User not found');
      }
    }
    async deleteUser(id: string): Promise<string> {
      const user = await this.getUserById(id);
      if (user) {
        return user.id;
      } else {
        throw new NotFoundException('User not found');
      }
    }
  }

  const mockNewProductId: string = 'dc190126-2828-4432-a142-6024410cec20';

  class MockProductsService extends ProductsService {}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockRolesGuard)
      .overrideProvider(UsersService)
      .useClass(MockUsersService)
      .overrideProvider(ProductsService)
      .useClass(MockProductsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('returns an array of users with an Ok status code', async () => {
      const req = await request(app.getHttpServer()).get('/users');
      expect(req.status).toBe(200);
      expect(req.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /users/:id', () => {
    it('returns an user with an Ok status code', async () => {
      const req = await request(app.getHttpServer()).get(
        `/users/${mockExistingUser.id}`,
      );
      expect(req.status).toBe(200);
      expect(req.body).toBeInstanceOf(Object);
    });

    it('throws a NotFoundException if the user is not found', async () => {
      const req = await request(app.getHttpServer()).get(`/users/${mockId}`);
      expect(req.status).toBe(404);
      expect(req.body.message).toBe('User not found');
    });
    it('throws an error if the id is not a UUID', async () => {
      const req = await request(app.getHttpServer()).get(`/users/not-a-uuid`);
      expect(req.status).toBe(400);
    });
  });

  describe('PUT /users/:id', () => {
    // it('updates an existing user and returns the user id', async () => {
    //   const req = await request(app.getHttpServer())
    //     .put(`/users/${mockExistingUser.id}`)
    //     .send(updateUsermock);

    //   expect(req.status).toBe(201);
    //   expect(req.body.id).toEqual(mockExistingUser.id);
    // });

    it('throws a NotFoundException if the user to update is not found', async () => {
      const req = await request(app.getHttpServer())
        .put(`/users/${mockId}`)
        .send(updateUsermock);
      expect(req.status).toBe(404);
      expect(req.body.message).toBe('User not found');
    });

    it('throws an error if the id is not a UUID', async () => {
      const req = await request(app.getHttpServer())
        .put('/users/not-a-uuid')
        .send(updateUsermock);
      expect(req.status).toBe(400);
    });
  });
  describe('DELETE /users/:id', () => {
    it('deletes an existing user from the DB and return an OK status code', async () => {
      const req = await request(app.getHttpServer()).delete(
        `/users/${mockExistingUser.id}`,
      );
      expect(req.status).toBe(200);
    });

    it('throws a NotFoundException if the user doesnt exist in the DB', async () => {
      const req = await request(app.getHttpServer()).delete(`/users/${mockId}`);
      expect(req.status).toBe(404);
      expect(req.body.message).toBe('User not found');
    });
  });

  describe('POST /products', () => {
    it('throws a NotFoundException if the category doesnt exist', async () => {
      const req = await request(app.getHttpServer()).post('/products');
      expect(req.status).toBe(404);
      expect(req.body.message).toBe('Category not found');
    });
  });
});
