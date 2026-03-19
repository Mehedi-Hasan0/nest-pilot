import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentOrmEntity } from './persistence/comment.orm-entity';
import { CommentRepositoryAdapter } from './persistence/comment.repository.adapter';
import { COMMENT_REPOSITORY_PORT } from '../../domain/comment/ports/comment.repository.port';
import { AddCommentUseCase } from '../../application/comment/add-comment/add-comment.use-case';
import { CommentController } from './http/comment.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentOrmEntity]), UserModule, PostModule],
  controllers: [CommentController],
  providers: [
    AddCommentUseCase,
    {
      provide: COMMENT_REPOSITORY_PORT,
      useClass: CommentRepositoryAdapter,
    },
  ],
  exports: [COMMENT_REPOSITORY_PORT, AddCommentUseCase],
})
export class CommentModule {}
