import { PostResponseDto } from '../../../application/post/common/post-response.dto';

/**
 * HTTP response shape for a Post resource.
 * Dates are serialised as ISO 8601 strings so JSON consumers get a stable format.
 */
export interface PostHttpResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * PostPresenter maps an Application-layer DTO to the final HTTP response shape.
 *
 * Responsibilities:
 * - Re-format fields for HTTP consumers (e.g. Date → ISO string)
 * - Act as the single seam for future additions (comment counts, links, etc.)
 *
 * Controllers must always return through a Presenter — never return a raw DTO or entity.
 */
export class PostPresenter {
  public static toResponse(dto: PostResponseDto): PostHttpResponse {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      authorId: dto.authorId,
      status: dto.status,
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
    };
  }
}
