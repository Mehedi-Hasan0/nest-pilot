import { Injectable, Inject } from '@nestjs/common';
import { AddCommentCommand } from './add-comment.command';
import { CommentResponseDto } from '../common/comment-response.dto';
import { Comment } from '../../../domain/comment/entities/comment.entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { PostId } from '../../../domain/post/value-objects/post-id.vo';
import { PostNotFoundError } from '../../../domain/post/errors/post.errors';
import { UserNotFoundError } from '../../../domain/user/errors/user.errors';
import {
  CommentRepositoryPort,
  COMMENT_REPOSITORY_PORT,
} from '../../../domain/comment/ports/comment.repository.port';
import {
  PostRepositoryPort,
  POST_REPOSITORY_PORT,
} from '../../../domain/post/ports/post.repository.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../../domain/user/ports/user.repository.port';

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_PORT)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(POST_REPOSITORY_PORT)
    private readonly postRepository: PostRepositoryPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  public async execute(command: AddCommentCommand): Promise<CommentResponseDto> {
    const authorId = UserId.create(command.authorId);
    const postId = PostId.create(command.postId);

    // 1. Enforce existence invariants across aggregates
    const postExists = await this.postRepository.findById(postId.value);
    if (!postExists) {
      throw new PostNotFoundError(postId.value);
    }

    const userExists = await this.userRepository.findById(authorId.value);
    if (!userExists) {
      throw new UserNotFoundError(authorId.value);
    }

    // 2. Create Domain Entity
    const comment = Comment.create({
      content: command.content,
      authorId,
      postId,
    });

    // 3. Persist
    await this.commentRepository.save(comment);

    return CommentResponseDto.fromEntity(comment);
  }
}
