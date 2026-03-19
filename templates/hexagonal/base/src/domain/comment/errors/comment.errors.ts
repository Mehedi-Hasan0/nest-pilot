import { DomainError } from '../../common/domain.error';

export class InvalidCommentContentError extends DomainError {
  constructor(details: string) {
    super(`Invalid comment content: ${details}`);
  }
}

export class CommentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Comment with ID ${id} was not found.`);
  }
}
