import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register-user.use-case';
import { USER_REPOSITORY_PORT } from '../../../domain/user/ports/user.repository.port';
import { RegisterUserCommand } from './register-user.command';
import { User } from '../../../domain/user/entities/user.entity';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let repository: any;

  beforeEach(async () => {
    repository = {
      exists: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: USER_REPOSITORY_PORT,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  it('should register a new user successfully', async () => {
    const command: RegisterUserCommand = {
      email: 'test@example.com',
      name: 'Test User',
      passwordRaw: 'password123',
    };

    repository.exists.mockResolvedValue(false);
    repository.save.mockImplementation((user: User) => Promise.resolve(user));

    const result = await useCase.execute(command);

    expect(result.email).toBe(command.email);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    const command: RegisterUserCommand = {
      email: 'existing@example.com',
      name: 'Test User',
      passwordRaw: 'password123',
    };

    repository.exists.mockResolvedValue(true);

    await expect(useCase.execute(command)).rejects.toThrow(
      'Email existing@example.com is already in use by another user.',
    );
  });
});
