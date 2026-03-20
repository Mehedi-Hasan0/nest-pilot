import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register-user.use-case';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../../../domain/user/ports/user.repository.port';
import { RegisterUserCommand } from './register-user.command';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  /**
   * Educational Note (PRD 8.2):
   * Mocks must be strictly typed against the Port interface (`UserRepositoryPort`),
   * never against a concrete implementation (adapter) or `any`. This proves the
   * Application layer conforms to the Hexagonal boundary.
   */
  let repository: jest.Mocked<Pick<UserRepositoryPort, 'exists' | 'save'>>;

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
    repository.save.mockResolvedValue();

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
