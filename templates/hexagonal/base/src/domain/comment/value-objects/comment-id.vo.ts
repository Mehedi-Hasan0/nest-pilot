import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class InvalidCommentIdError extends Error {
  constructor(id: string) {
    super(`Invalid Comment ID format: ${id}. Must be a valid UUID.`);
    this.name = 'InvalidCommentIdError';
  }
}

export class CommentId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!uuidValidate(value)) {
      throw new InvalidCommentIdError(value);
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): CommentId {
    return new CommentId(value);
  }

  public static generate(): CommentId {
    return new CommentId(uuidv4());
  }

  public equals(other: CommentId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}
