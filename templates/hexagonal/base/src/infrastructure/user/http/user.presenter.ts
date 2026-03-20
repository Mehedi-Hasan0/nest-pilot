import { UserResponseDto } from '../../../application/user/common/user-response.dto';

/**
 * HTTP response shape for a User resource.
 * Dates are serialised as ISO 8601 strings so JSON consumers get a stable format.
 */
export interface UserHttpResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * UserPresenter maps an Application-layer DTO to the final HTTP response shape.
 *
 * Responsibilities:
 * - Re-format fields for HTTP consumers (e.g. Date → ISO string)
 * - Exclude internal fields that must not be exposed (e.g. passwordHash)
 * - Act as the single seam where future HATEOAS links or versioned shapes can be added
 *
 * Controllers must always return through a Presenter — never return a raw DTO or entity.
 */
export class UserPresenter {
  public static toResponse(dto: UserResponseDto): UserHttpResponse {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      createdAt: dto.createdAt.toISOString(),
    };
  }
}
