import { Controller, Post, Body, Param, Get, Patch, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostUseCase } from '../../../application/post/create-post/create-post.use-case';
import { PublishPostUseCase } from '../../../application/post/publish-post/publish-post.use-case';
import { GetPostUseCase } from '../../../application/post/get-post/get-post.use-case';
import { CreatePostRequestDto } from './dto/create-post.request.dto';
import { CreatePostCommand } from '../../../application/post/create-post/create-post.command';
import { PostResponseDto } from '../../../application/post/common/post-response.dto';

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
  @ApiResponse({ status: 201, type: PostResponseDto })
  public async createPost(@Body() dto: CreatePostRequestDto): Promise<PostResponseDto> {
    const command = new CreatePostCommand(dto.title, dto.content, dto.authorId);
    return this.createPostUseCase.execute(command);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, type: PostResponseDto })
  public async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    return this.getPostUseCase.execute(id);
  }

  @Patch(':id/publish')
  @HttpCode(200)
  @ApiOperation({ summary: 'Publish a draft post' })
  @ApiResponse({ status: 200, type: PostResponseDto })
  public async publishPost(@Param('id') id: string): Promise<PostResponseDto> {
    return this.publishPostUseCase.execute(id);
  }
}
