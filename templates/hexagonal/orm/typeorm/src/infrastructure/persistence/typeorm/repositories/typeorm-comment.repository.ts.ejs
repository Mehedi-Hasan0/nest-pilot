import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentRepositoryPort } from '../../../domain/comment/ports/comment.repository.port';
import { Comment } from '../../../domain/comment/entities/comment.entity';
import { CommentOrmEntity } from './comment.orm-entity';
import { CommentMapper } from './comment.mapper';

@Injectable()
export class CommentRepositoryAdapter implements CommentRepositoryPort {
  constructor(
    @InjectRepository(CommentOrmEntity)
    private readonly repository: Repository<CommentOrmEntity>,
  ) {}

  public async save(comment: Comment): Promise<void> {
    const ormEntity = CommentMapper.toOrm(comment);
    await this.repository.save(ormEntity);
  }

  public async findByPostId(postId: string): Promise<Comment[]> {
    const ormEntities = await this.repository.find({
      where: { postId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((entity: CommentOrmEntity) => CommentMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<Comment | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) {
      return null;
    }
    return CommentMapper.toDomain(ormEntity);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
