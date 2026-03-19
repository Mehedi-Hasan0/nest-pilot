import { DomainError } from '../../common/domain.error';

export class PostNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Post with ID ${id} was not found.`);
  }
}

export class InvalidPostStateTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Cannot transition Post from ${from} to ${to}.`);
  }
}

export class CannotChangePublishedPostTitleError extends DomainError {
  constructor() {
    super(`Cannot change the title of a published post.`);
  }
}

export class InvalidPostTitleLengthError extends DomainError {
  constructor() {
    super(`Post title must be between 3 and 200 characters.`);
  }
}

export class InvalidPostContentLengthError extends DomainError {
  constructor() {
    super(`Post content must be at least 10 characters long.`);
  }
}
