import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../domain/user/ports/user.repository.port';
import { User } from '../../../domain/user/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  public async save(user: User): Promise<void> {
    const ormEntity = UserMapper.toOrm(user);
    await this.repository.save(ormEntity);
  }

  public async findById(id: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) {
      return null;
    }
    return UserMapper.toDomain(ormEntity);
  }

  public async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    if (!ormEntity) {
      return null;
    }
    return UserMapper.toDomain(ormEntity);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
