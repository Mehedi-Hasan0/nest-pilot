import { BaseEntity } from '../../common/base.entity';
import { CommentId } from '../value-objects/comment-id.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import { PostId } from '../../post/value-objects/post-id.vo';
import { InvalidCommentContentError } from '../errors/comment.errors';

export interface CommentProps {
  content: string;
  authorId: UserId;
  postId: PostId;
}

export class Comment extends BaseEntity<CommentId> {
  private _content: string;
  private readonly _authorId: UserId;
  private readonly _postId: PostId;

  private constructor(id: CommentId, props: CommentProps, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.validateContent(props.content);

    this._content = props.content;
    this._authorId = props.authorId;
    this._postId = props.postId;
  }

  public static create(props: CommentProps): Comment {
    const id = CommentId.generate();
    return new Comment(id, props);
  }

  public static reconstitute(
    id: string,
    props: { content: string; authorId: string; postId: string },
    createdAt: Date,
    updatedAt?: Date,
  ): Comment {
    return new Comment(
      CommentId.create(id),
      {
        content: props.content,
        authorId: UserId.create(props.authorId),
        postId: PostId.create(props.postId),
      },
      createdAt,
      updatedAt,
    );
  }

  get content(): string {
    return this._content;
  }

  get authorId(): UserId {
    return this._authorId;
  }

  get postId(): PostId {
    return this._postId;
  }

  public updateContent(newContent: string): void {
    this.validateContent(newContent);
    this._content = newContent;
    this.markUpdated();
  }

  private validateContent(content: string): void {
    const trimmed = content?.trim() || '';
    if (trimmed.length < 1 || trimmed.length > 500) {
      throw new InvalidCommentContentError('Content must be between 1 and 500 characters.');
    }
  }
}
