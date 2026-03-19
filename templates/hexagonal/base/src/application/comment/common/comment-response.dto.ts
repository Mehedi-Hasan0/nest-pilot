import { Comment } from '../../../domain/comment/entities/comment.entity';

export class CommentResponseDto {
  public readonly id: string;
  public readonly content: string;
  public readonly authorId: string;
  public readonly postId: string;
  public readonly createdAt: Date;

  constructor(id: string, content: string, authorId: string, postId: string, createdAt: Date) {
    this.id = id;
    this.content = content;
    this.authorId = authorId;
    this.postId = postId;
    this.createdAt = createdAt;
  }

  public static fromEntity(comment: Comment): CommentResponseDto {
    return new CommentResponseDto(
      comment.id.value,
      comment.content,
      comment.authorId.value,
      comment.postId.value,
      comment.createdAt,
    );
  }
}
