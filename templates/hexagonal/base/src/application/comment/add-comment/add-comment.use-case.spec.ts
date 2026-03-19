import { Test, TestingModule } from '@nestjs/testing';
import { AddCommentUseCase } from './add-comment.use-case';
import { COMMENT_REPOSITORY_PORT } from '../../../domain/comment/ports/comment.repository.port';
import { USER_REPOSITORY_PORT } from '../../../domain/user/ports/user.repository.port';
import { POST_REPOSITORY_PORT } from '../../../domain/post/ports/post.repository.port';

describe('AddCommentUseCase', () => {
  let useCase: AddCommentUseCase;
  let commentRepo: any;
  let userRepo: any;
  let postRepo: any;

  beforeEach(async () => {
    commentRepo = { save: jest.fn() };
    userRepo = { findById: jest.fn() };
    postRepo = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddCommentUseCase,
        { provide: COMMENT_REPOSITORY_PORT, useValue: commentRepo },
        { provide: USER_REPOSITORY_PORT, useValue: userRepo },
        { provide: POST_REPOSITORY_PORT, useValue: postRepo },
      ],
    }).compile();

    useCase = module.get<AddCommentUseCase>(AddCommentUseCase);
  });

  it('should throw error if post not found', async () => {
    const command = {
      postId: '550e8400-e29b-41d4-a716-446655440000',
      authorId: '550e8400-e29b-41d4-a716-446655440001',
      content: 'Hello',
    };
    postRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(
      'Post with ID 550e8400-e29b-41d4-a716-446655440000 was not found.',
    );
  });

  it('should throw error if user not found', async () => {
    const command = {
      postId: '550e8400-e29b-41d4-a716-446655440000',
      authorId: '550e8400-e29b-41d4-a716-446655440001',
      content: 'Hello',
    };
    postRepo.findById.mockResolvedValue({ id: '550e8400-e29b-41d4-a716-446655440000' });
    userRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(
      'User with ID 550e8400-e29b-41d4-a716-446655440001 was not found.',
    );
  });

  it('should add a comment successfully', async () => {
    const command = {
      postId: '550e8400-e29b-41d4-a716-446655440000',
      authorId: '550e8400-e29b-41d4-a716-446655440001',
      content: 'Hello',
    };
    postRepo.findById.mockResolvedValue({ id: '550e8400-e29b-41d4-a716-446655440000' });
    userRepo.findById.mockResolvedValue({ id: '550e8400-e29b-41d4-a716-446655440001' });
    commentRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(command);

    expect(result.content).toBe(command.content);
    expect(commentRepo.save).toHaveBeenCalled();
  });
});
