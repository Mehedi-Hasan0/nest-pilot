import { User } from '../../../domain/user/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  public static toDomain(ormEntity: UserOrmEntity): User {
    return User.reconstitute(
      ormEntity.id,
      {
        name: ormEntity.name,
        email: ormEntity.email,
        passwordHash: ormEntity.passwordHash,
      },
      ormEntity.createdAt,
    );
  }

  public static toOrm(domainEntity: User): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainEntity.id.value;
    ormEntity.name = domainEntity.name;
    ormEntity.email = domainEntity.email.value;
    ormEntity.passwordHash = domainEntity.passwordHash;
    ormEntity.createdAt = domainEntity.createdAt;
    // Note: updatedAt might be added here if defined in both layers
    return ormEntity;
  }
}
