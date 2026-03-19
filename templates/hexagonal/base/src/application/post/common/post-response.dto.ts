import { Post } from '../../../domain/post/entities/post.entity';

export class PostResponseDto {
  public readonly id: string;
  public readonly title: string;
  public readonly content: string;
  public readonly authorId: string;
  public readonly status: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    title: string,
    content: string,
    authorId: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static fromEntity(post: Post): PostResponseDto {
    return new PostResponseDto(
      post.id.value,
      post.title.value,
      post.content.value,
      post.authorId.value,
      post.status,
      post.createdAt,
      post.updatedAt,
    );
  }
}
