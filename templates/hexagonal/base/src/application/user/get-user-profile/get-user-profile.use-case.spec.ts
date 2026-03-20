import { GetUserProfileUseCase } from './get-user-profile.use-case';
import { UserRepositoryPort } from '../../../domain/user/ports/user.repository.port';
import { UserNotFoundError } from '../../../domain/user/errors/user.errors';
import { UserResponseDto } from '../common/user-response.dto';
import { GetUserProfileQuery } from './get-user-profile.query';
import { User } from '../../../domain/user/entities/user.entity';

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;

  /**
   * Educational Note (PRD 8.2):
   * We type our mock strictly against the Port interface (UserRepositoryPort),
   * not against the concrete TypeORM adapter. We use `Pick` to mock only
   * the methods this specific use case requires.
   */
  let mockUserRepository: jest.Mocked<Pick<UserRepositoryPort, 'findById'>>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    };

    useCase = new GetUserProfileUseCase(mockUserRepository as unknown as UserRepositoryPort);
  });

  describe('execute', () => {
    it('should return a UserResponseDto when the user matches the ID', async () => {
      // Arrange
      const existingUser = User.reconstitute(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          email: 'foo@bar.com',
          name: 'Foo Bar',
          passwordHash: 'hashed-password',
        },
        new Date(),
        new Date(),
      );

      mockUserRepository.findById.mockResolvedValue(existingUser);

      // Act
      const query = new GetUserProfileQuery('123e4567-e89b-12d3-a456-426614174000');
      const result = await useCase.execute(query);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.email).toBe('foo@bar.com');
      expect(result.name).toBe('Foo Bar');
    });

    it('should throw UserNotFoundError if no user matches the ID', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      const query = new GetUserProfileQuery('223e4567-e89b-12d3-a456-426614174000');
      await expect(useCase.execute(query)).rejects.toThrow(
        new UserNotFoundError('223e4567-e89b-12d3-a456-426614174000'),
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        '223e4567-e89b-12d3-a456-426614174000',
      );
    });
  });
});
