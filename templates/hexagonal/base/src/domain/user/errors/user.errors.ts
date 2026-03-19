export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`The email address "${email}" is already registered to another user.`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class EmailAlreadySetError extends Error {
  constructor(email: string) {
    super(`The user's email is already set to ${email}.`);
    this.name = 'EmailAlreadySetError';
  }
}

export class InvalidNameError extends Error {
  constructor() {
    super('A user name must be between 2 and 100 characters long.');
    this.name = 'InvalidNameError';
  }
}
