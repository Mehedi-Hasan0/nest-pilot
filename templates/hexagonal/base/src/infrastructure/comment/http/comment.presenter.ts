import { CommentResponseDto } from '../../../application/comment/common/comment-response.dto';

/**
 * HTTP response shape for a Comment resource.
 * Dates are serialised as ISO 8601 strings so JSON consumers get a stable format.
 */
export interface CommentHttpResponse {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

/**
 * CommentPresenter maps an Application-layer DTO to the final HTTP response shape.
 *
 * Responsibilities:
 * - Re-format fields for HTTP consumers (e.g. Date → ISO string)
 * - Act as the single seam for future additions (author name, post title, etc.)
 *
 * Controllers must always return through a Presenter — never return a raw DTO or entity.
 */
export class CommentPresenter {
  public static toResponse(dto: CommentResponseDto): CommentHttpResponse {
    return {
      id: dto.id,
      content: dto.content,
      authorId: dto.authorId,
      postId: dto.postId,
      createdAt: dto.createdAt.toISOString(),
    };
  }
}
