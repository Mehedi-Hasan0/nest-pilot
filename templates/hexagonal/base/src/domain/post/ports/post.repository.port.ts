import { Post } from '../entities/post.entity';

export interface PostRepositoryPort {
  findById(id: string): Promise<Post | null>;
  save(post: Post): Promise<void>;
  delete(id: string): Promise<void>;
}

// INJECTION TOKEN
// The Application layer will use this symbol in their Use Cases to ask NestJS for an injecting provider.
export const POST_REPOSITORY_PORT = Symbol('PostRepositoryPort');
