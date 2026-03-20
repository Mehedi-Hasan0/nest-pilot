import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostRepositoryPort } from '../../../domain/post/ports/post.repository.port';
import { Post } from '../../../domain/post/entities/post.entity';
import { PostOrmEntity } from './post.orm-entity';
import { PostMapper } from './post.mapper';

@Injectable()
export class PostRepositoryAdapter implements PostRepositoryPort {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repository: Repository<PostOrmEntity>,
  ) {}

  public async save(post: Post): Promise<void> {
    const ormEntity = PostMapper.toOrm(post);
    await this.repository.save(ormEntity);
  }

  public async findById(id: string): Promise<Post | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) {
      return null;
    }
    return PostMapper.toDomain(ormEntity);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
