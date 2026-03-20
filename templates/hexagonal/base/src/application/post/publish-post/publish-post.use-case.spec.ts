import { PublishPostUseCase } from './publish-post.use-case';
import { PostRepositoryPort } from '../../../domain/post/ports/post.repository.port';
import {
  PostNotFoundError,
  InvalidPostStateTransitionError,
  UnauthorizedPostActionError,
} from '../../../domain/post/errors/post.errors';
import { PostResponseDto } from '../common/post-response.dto';
import { Post, PostStatus } from '../../../domain/post/entities/post.entity';
import { PublishPostCommand } from './publish-post.command';

describe('PublishPostUseCase', () => {
  let useCase: PublishPostUseCase;

  /**
   * Educational Note (PRD 8.2):
   * Mock typed strictly against the Port interface to enforce hexagonal boundaries.
   */
  let mockPostRepository: jest.Mocked<Pick<PostRepositoryPort, 'findById' | 'save'>>;

  beforeEach(() => {
    mockPostRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    useCase = new PublishPostUseCase(mockPostRepository as unknown as PostRepositoryPort);
  });

  describe('execute', () => {
    it('should publish a draft post and return a PostResponseDto', async () => {
      // Arrange
      const draftPost = Post.reconstitute(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          title: 'Draft Title',
          content: 'Some draft content',
          authorId: '550e8400-e29b-41d4-a716-446655440000',
          status: PostStatus.DRAFT,
        },
        new Date(),
        new Date(),
      );

      mockPostRepository.findById.mockResolvedValue(draftPost);
      mockPostRepository.save.mockResolvedValue();

      // Act
      const command = new PublishPostCommand(
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
      );
      const result = await useCase.execute(command);

      // Assert
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(mockPostRepository.save).toHaveBeenCalledWith(draftPost);
      expect(draftPost.status).toBe('PUBLISHED'); // Verify entity was mutated
      expect(result).toBeInstanceOf(PostResponseDto);
      expect(result.status).toBe('PUBLISHED');
    });

    it('should throw PostNotFoundError if the post does not exist', async () => {
      // Arrange
      mockPostRepository.findById.mockResolvedValue(null);

      // Act & Assert
      const command = new PublishPostCommand(
        '223e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
      );
      await expect(useCase.execute(command)).rejects.toThrow(
        new PostNotFoundError('223e4567-e89b-12d3-a456-426614174000'),
      );
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedPostActionError if the requesting user is not the author', async () => {
      // Arrange
      const draftPost = Post.reconstitute(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          title: 'Draft Title',
          content: 'Some draft content',
          authorId: '550e8400-e29b-41d4-a716-446655440000',
          status: PostStatus.DRAFT,
        },
        new Date(),
        new Date(),
      );

      mockPostRepository.findById.mockResolvedValue(draftPost);

      // Act & Assert
      const command = new PublishPostCommand(
        '123e4567-e89b-12d3-a456-426614174000',
        '999e4567-e89b-12d3-a456-426614174000', // Different user
      );

      await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedPostActionError);
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should throw InvalidPostStateTransitionError if the post is already published', async () => {
      // Arrange
      const publishedPost = Post.reconstitute(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          title: 'Published Title',
          content: 'Some published content',
          authorId: '550e8400-e29b-41d4-a716-446655440000',
          status: PostStatus.PUBLISHED,
        },
        new Date(),
        new Date(),
      );

      mockPostRepository.findById.mockResolvedValue(publishedPost);

      // Act & Assert
      // The entity itself throws this domain error
      const command = new PublishPostCommand(
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
      );
      await expect(useCase.execute(command)).rejects.toThrow(
        new InvalidPostStateTransitionError('PUBLISHED', 'PUBLISHED'),
      );

      // Save should never be called if domain logic rejects the state transition
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });
  });
});
