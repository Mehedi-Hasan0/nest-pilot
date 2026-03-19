import { Comment } from '../entities/comment.entity';

export interface CommentRepositoryPort {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
  delete(id: string): Promise<void>;
}

// INJECTION TOKEN
// The Application layer will use this symbol in their Use Cases to ask NestJS for an injecting provider.
export const COMMENT_REPOSITORY_PORT = Symbol('CommentRepositoryPort');
