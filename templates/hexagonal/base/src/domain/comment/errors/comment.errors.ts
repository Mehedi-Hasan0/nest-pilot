export class InvalidCommentContentError extends Error {
  constructor() {
    super('A comment must be between 1 and 500 characters long.');
    this.name = 'InvalidCommentContentError';
  }
}

export class CommentNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Comment not found: ${identifier}`);
    this.name = 'CommentNotFoundError';
  }
}
