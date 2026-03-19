import { DomainError } from '../../common/domain.error';

export class InvalidUserIdError extends DomainError {
  constructor(id: string) {
    super(`Invalid User ID format: ${id}`);
  }
}

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is already in use by another user.`);
  }
}

export class EmailAlreadySetError extends DomainError {
  constructor() {
    super(`User already has this email set.`);
  }
}

export class InvalidNameError extends DomainError {
  constructor(name: string) {
    super(`Invalid name: ${name}. Name must be between 2 and 100 characters.`);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with ID ${id} was not found.`);
  }
}
