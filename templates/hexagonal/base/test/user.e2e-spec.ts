import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { USER_REPOSITORY_PORT } from '../src/domain/user/ports/user.repository.port';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepo: any;

  beforeEach(async () => {
    userRepo = {
      exists: jest.fn(),
      save: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY_PORT)
      .useValue(userRepo)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users (Public - Register)', async () => {
    userRepo.exists.mockResolvedValue(false);
    userRepo.save.mockImplementation((u: any) => Promise.resolve(u));

    const response = await request(app.getHttpServer()).post('/users').send({
      email: 'test@example.com',
      name: 'Test User',
      passwordRaw: 'Password123!',
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('test@example.com');
  });

  it('GET /users/me (Authenticated)', async () => {
    // This would typically involve generating a JWT,
    // but for this smoke test we just verify the guard blocks it without token
    const response = await request(app.getHttpServer()).get('/users/me');

    expect(response.status).toBe(401);
  });
});
