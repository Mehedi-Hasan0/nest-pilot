import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostUseCase } from './create-post.use-case';
import {
  POST_REPOSITORY_PORT,
  PostRepositoryPort,
} from '../../../domain/post/ports/post.repository.port';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;

  /**
   * Educational Note (PRD 8.2):
   * Mocks must be strictly typed against the Port interface (`PostRepositoryPort`),
   * never against a concrete implementation (adapter) or `any`.
   */
  let postRepo: jest.Mocked<Pick<PostRepositoryPort, 'save'>>;

  beforeEach(async () => {
    postRepo = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        {
          provide: POST_REPOSITORY_PORT,
          useValue: postRepo,
        },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
  });

  it('should successfully create a post', async () => {
    const command = {
      title: 'Valid Post Title',
      content: 'Valid content that is at least 10 characters long.',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
    };

    postRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(command);

    expect(result.title).toBe(command.title);
    expect(result.status).toBe('DRAFT');
    expect(postRepo.save).toHaveBeenCalled();
  });

  it('should throw error for invalid title', async () => {
    const command = {
      title: 'No',
      content: 'Valid content that is at least 10 characters long.',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
    };

    await expect(useCase.execute(command)).rejects.toThrow();
  });

  it('should throw error for invalid content', async () => {
    const command = {
      title: 'Valid Title',
      content: 'Short',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
    };

    await expect(useCase.execute(command)).rejects.toThrow();
  });
});
