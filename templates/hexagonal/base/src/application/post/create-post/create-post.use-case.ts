import { Injectable, Inject } from '@nestjs/common';
import { CreatePostCommand } from './create-post.command';
import { PostResponseDto } from '../common/post-response.dto';
import { Post } from '../../../domain/post/entities/post.entity';
import { PostTitle } from '../../../domain/post/value-objects/post-title.vo';
import { PostContent } from '../../../domain/post/value-objects/post-content.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import {
  PostRepositoryPort,
  POST_REPOSITORY_PORT,
} from '../../../domain/post/ports/post.repository.port';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY_PORT)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  public async execute(command: CreatePostCommand): Promise<PostResponseDto> {
    // 1. Transform raw command input into validated Domain Value Objects
    const title = PostTitle.create(command.title);
    const content = PostContent.create(command.content);
    const authorId = UserId.create(command.authorId);

    // 2. Create the Domain Entity in Draft state
    const post = Post.createDraft({
      title,
      content,
      authorId,
    });

    // 3. Persist via the Domain Port interface
    await this.postRepository.save(post);

    // 4. Map the domain entity to a safe DTO before returning to Controller
    return PostResponseDto.fromEntity(post);
  }
}
