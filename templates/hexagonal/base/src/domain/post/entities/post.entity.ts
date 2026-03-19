import { BaseEntity } from '../../common/base.entity';
import { PostId } from '../value-objects/post-id.vo';
import { PostTitle } from '../value-objects/post-title.vo';
import { PostContent } from '../value-objects/post-content.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import {
  InvalidPostStateTransitionError,
  CannotChangePublishedPostTitleError,
} from '../errors/post.errors';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

export interface PostProps {
  title: PostTitle;
  content: PostContent;
  authorId: UserId;
  status: PostStatus;
}

export class Post extends BaseEntity<PostId> {
  private _title: PostTitle;
  private _content: PostContent;
  private readonly _authorId: UserId;
  private _status: PostStatus;

  private constructor(id: PostId, props: PostProps, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._title = props.title;
    this._content = props.content;
    this._authorId = props.authorId;
    this._status = props.status;
  }

  public static createDraft(props: Omit<PostProps, 'status'>): Post {
    const id = PostId.generate();
    return new Post(id, { ...props, status: PostStatus.DRAFT });
  }

  public static reconstitute(
    id: string,
    props: {
      title: string;
      content: string;
      authorId: string;
      status: PostStatus;
    },
    createdAt: Date,
    updatedAt: Date,
  ): Post {
    return new Post(
      PostId.create(id),
      {
        title: PostTitle.create(props.title),
        content: PostContent.create(props.content),
        authorId: UserId.create(props.authorId),
        status: props.status,
      },
      createdAt,
      updatedAt,
    );
  }

  get title(): PostTitle {
    return this._title;
  }

  get content(): PostContent {
    return this._content;
  }

  get authorId(): UserId {
    return this._authorId;
  }

  get status(): PostStatus {
    return this._status;
  }

  public publish(): void {
    if (this._status !== PostStatus.DRAFT) {
      throw new InvalidPostStateTransitionError(this._status, PostStatus.PUBLISHED);
    }
    this._status = PostStatus.PUBLISHED;
    this.markUpdated();
  }

  public unpublish(): void {
    if (this._status !== PostStatus.PUBLISHED) {
      throw new InvalidPostStateTransitionError(this._status, PostStatus.UNPUBLISHED);
    }
    this._status = PostStatus.UNPUBLISHED;
    this.markUpdated();
  }

  public changeTitle(newTitle: PostTitle): void {
    if (this._status === PostStatus.PUBLISHED) {
      throw new CannotChangePublishedPostTitleError();
    }
    this._title = newTitle;
    this.markUpdated();
  }

  public updateContent(newContent: PostContent): void {
    this._content = newContent;
    this.markUpdated();
  }
}
