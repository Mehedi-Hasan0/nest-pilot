export class PostNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Post not found: ${identifier}`);
    this.name = 'PostNotFoundError';
  }
}

export class InvalidPostStateTransitionError extends Error {
  constructor(fromState: string, toState: string) {
    super(`Cannot transition a post from ${fromState} to ${toState}.`);
    this.name = 'InvalidPostStateTransitionError';
  }
}

export class CannotChangePublishedPostTitleError extends Error {
  constructor() {
    super('The title of a published post cannot be modified.');
    this.name = 'CannotChangePublishedPostTitleError';
  }
}
