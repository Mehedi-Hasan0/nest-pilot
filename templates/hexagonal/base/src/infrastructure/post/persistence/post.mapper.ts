import { Post } from '../../../domain/post/entities/post.entity';
import { PostOrmEntity } from './post.orm-entity';

export class PostMapper {
  public static toDomain(ormEntity: PostOrmEntity): Post {
    return Post.reconstitute(
      ormEntity.id,
      {
        title: ormEntity.title,
        content: ormEntity.content,
        authorId: ormEntity.authorId,
        status: ormEntity.status as any, // Cast to union type handled safely in domain
      },
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  public static toOrm(domainEntity: Post): PostOrmEntity {
    const ormEntity = new PostOrmEntity();
    ormEntity.id = domainEntity.id.value;
    ormEntity.title = domainEntity.title.value;
    ormEntity.content = domainEntity.content.value;
    ormEntity.authorId = domainEntity.authorId.value;
    ormEntity.status = domainEntity.status;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
