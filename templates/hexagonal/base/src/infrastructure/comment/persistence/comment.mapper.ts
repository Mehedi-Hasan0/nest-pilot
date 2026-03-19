import { Comment } from '../../../domain/comment/entities/comment.entity';
import { CommentOrmEntity } from './comment.orm-entity';

export class CommentMapper {
  public static toDomain(ormEntity: CommentOrmEntity): Comment {
    return Comment.reconstitute(
      ormEntity.id,
      {
        content: ormEntity.content,
        authorId: ormEntity.authorId,
        postId: ormEntity.postId,
      },
      ormEntity.createdAt,
    );
  }

  public static toOrm(domainEntity: Comment): CommentOrmEntity {
    const ormEntity = new CommentOrmEntity();
    ormEntity.id = domainEntity.id.value;
    ormEntity.content = domainEntity.content;
    ormEntity.authorId = domainEntity.authorId.value;
    ormEntity.postId = domainEntity.postId.value;
    ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
