import { Controller, Post, Body, Param, Get, Patch, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostUseCase } from '../../../application/post/create-post/create-post.use-case';
import { PublishPostUseCase } from '../../../application/post/publish-post/publish-post.use-case';
import { GetPostUseCase } from '../../../application/post/get-post/get-post.use-case';
import { CreatePostRequestDto } from './dto/create-post.request.dto';
import { CreatePostCommand } from '../../../application/post/create-post/create-post.command';
import { PostPresenter, PostHttpResponse } from './post.presenter';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new draft post' })
  @ApiResponse({ status: 201, description: 'Draft post created successfully' })
  public async createPost(@Body() dto: CreatePostRequestDto): Promise<PostHttpResponse> {
    const result = await this.createPostUseCase.execute(
      new CreatePostCommand(dto.title, dto.content, dto.authorId),
    );
    return PostPresenter.toResponse(result);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Post returned successfully' })
  public async getPost(@Param('id') id: string): Promise<PostHttpResponse> {
    const result = await this.getPostUseCase.execute(id);
    return PostPresenter.toResponse(result);
  }

  @Patch(':id/publish')
  @HttpCode(200)
  @ApiOperation({ summary: 'Publish a draft post' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  public async publishPost(@Param('id') id: string): Promise<PostHttpResponse> {
    const result = await this.publishPostUseCase.execute(id);
    return PostPresenter.toResponse(result);
  }
}
