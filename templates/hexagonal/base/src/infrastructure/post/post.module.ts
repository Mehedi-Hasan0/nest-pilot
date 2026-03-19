import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostOrmEntity } from './persistence/post.orm-entity';
import { PostRepositoryAdapter } from './persistence/post.repository.adapter';
import { POST_REPOSITORY_PORT } from '../../domain/post/ports/post.repository.port';
import { CreatePostUseCase } from '../../application/post/create-post/create-post.use-case';
import { PublishPostUseCase } from '../../application/post/publish-post/publish-post.use-case';
import { GetPostUseCase } from '../../application/post/get-post/get-post.use-case';
import { PostController } from './http/post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity])],
  controllers: [PostController],
  providers: [
    CreatePostUseCase,
    PublishPostUseCase,
    GetPostUseCase,
    {
      provide: POST_REPOSITORY_PORT,
      useClass: PostRepositoryAdapter,
    },
  ],
  exports: [POST_REPOSITORY_PORT, CreatePostUseCase, PublishPostUseCase, GetPostUseCase],
})
export class PostModule {}
