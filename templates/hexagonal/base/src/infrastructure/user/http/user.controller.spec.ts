import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { RegisterUserUseCase } from '../../../application/user/register-user/register-user.use-case';
import { GetUserProfileUseCase } from '../../../application/user/get-user-profile/get-user-profile.use-case';
import { GetUserProfileQuery } from '../../../application/user/get-user-profile/get-user-profile.query';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { UserResponseDto } from '../../../application/user/common/user-response.dto';
import { EmailAlreadyInUseError, UserNotFoundError } from '../../../domain/user/errors/user.errors';

describe('UserController', () => {
  let controller: UserController;
  let mockRegisterUserUseCase: jest.Mocked<Pick<RegisterUserUseCase, 'execute'>>;
  let mockGetUserProfileUseCase: jest.Mocked<Pick<GetUserProfileUseCase, 'execute'>>;

  beforeEach(async () => {
    mockRegisterUserUseCase = {
      execute: jest.fn(),
    };

    mockGetUserProfileUseCase = {
      execute: jest.fn(),
    };

    // PRD 8.3: Testing the infrastructure layer.
    // It is acceptable (and encouraged) to use NestJS TestingModule here to verify
    // dependency injection wiring and decorators (though guards/filters are best
    // tested via standard e2e tests).
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: mockRegisterUserUseCase,
        },
        {
          provide: GetUserProfileUseCase,
          useValue: mockGetUserProfileUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('registerUser', () => {
    it('should route to RegisterUserUseCase and return a mapped UserHttpResponse', async () => {
      // Arrange
      const dto: RegisterUserRequestDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123!',
      };

      const date = new Date('2026-03-20T12:00:00Z');
      const responseDto = new UserResponseDto('user-123', 'test@example.com', 'Test User', date);

      mockRegisterUserUseCase.execute.mockResolvedValue(responseDto);

      // Act
      const result = await controller.registerUser(dto);

      // Assert
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledTimes(1);
      const commandArg = mockRegisterUserUseCase.execute.mock.calls[0][0];
      expect(commandArg.email).toBe('test@example.com');

      // Presenter shape mapping is verified
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2026-03-20T12:00:00.000Z', // ISO string
      });
    });

    it('should bubble up domain exceptions thrown by the use case', async () => {
      // Arrange
      const dto: RegisterUserRequestDto = {
        email: 'taken@example.com',
        name: 'Test User',
        password: 'securePassword123!',
      };

      mockRegisterUserUseCase.execute.mockRejectedValue(
        new EmailAlreadyInUseError('taken@example.com'),
      );

      // Act & Assert
      // The controller itself shouldn't catch this; the global DomainExceptionFilter does.
      await expect(controller.registerUser(dto)).rejects.toThrow(EmailAlreadyInUseError);
    });
  });

  describe('getUserProfile', () => {
    it('should route to GetUserProfileUseCase and return a mapped UserHttpResponse', async () => {
      // Arrange
      const date = new Date('2026-03-20T12:00:00Z');
      const responseDto = new UserResponseDto('user-123', 'test@example.com', 'Test User', date);

      mockGetUserProfileUseCase.execute.mockResolvedValue(responseDto);

      // Act
      const result = await controller.getUserProfile('user-123');

      // Assert
      expect(mockGetUserProfileUseCase.execute).toHaveBeenCalledWith(
        new GetUserProfileQuery('user-123'),
      );
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2026-03-20T12:00:00.000Z',
      });
    });

    it('should bubble up UserNotFoundError thrown by the use case', async () => {
      // Arrange
      mockGetUserProfileUseCase.execute.mockRejectedValue(new UserNotFoundError('bad-id'));

      // Act & Assert
      await expect(controller.getUserProfile('bad-id')).rejects.toThrow(UserNotFoundError);
    });
  });
});
