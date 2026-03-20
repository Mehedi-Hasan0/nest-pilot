import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddCommentUseCase } from '../../../application/comment/add-comment/add-comment.use-case';
import { AddCommentRequestDto } from './dto/add-comment.request.dto';
import { AddCommentCommand } from '../../../application/comment/add-comment/add-comment.command';
import { CommentPresenter, CommentHttpResponse } from './comment.presenter';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly addCommentUseCase: AddCommentUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  public async addComment(@Body() dto: AddCommentRequestDto): Promise<CommentHttpResponse> {
    const result = await this.addCommentUseCase.execute(
      new AddCommentCommand(dto.content, dto.authorId, dto.postId),
    );
    return CommentPresenter.toResponse(result);
  }
}
