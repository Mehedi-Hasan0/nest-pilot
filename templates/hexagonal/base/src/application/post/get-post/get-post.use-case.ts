import { Injectable, Inject } from '@nestjs/common';
import { PostResponseDto } from '../common/post-response.dto';
import { PostNotFoundError } from '../../../domain/post/errors/post.errors';
import {
  PostRepositoryPort,
  POST_REPOSITORY_PORT,
} from '../../../domain/post/ports/post.repository.port';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY_PORT)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  public async execute(postId: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new PostNotFoundError(postId);
    }

    return PostResponseDto.fromEntity(post);
  }
}
