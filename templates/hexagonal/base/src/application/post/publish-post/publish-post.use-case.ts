import { Injectable, Inject } from '@nestjs/common';
import { PostResponseDto } from '../common/post-response.dto';
import { PostNotFoundError } from '../../../domain/post/errors/post.errors';
import {
  PostRepositoryPort,
  POST_REPOSITORY_PORT,
} from '../../../domain/post/ports/post.repository.port';

@Injectable()
export class PublishPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY_PORT)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  public async execute(postId: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new PostNotFoundError(postId);
    }

    // 1. Delegate behavior completely to Domain Entity
    // The Application layer doesn't check if the state is DRAFT.
    // The Entity itself validates the transition and throws if invalid.
    post.publish();

    // 2. Save mutated Entity
    await this.postRepository.save(post);

    return PostResponseDto.fromEntity(post);
  }
}
