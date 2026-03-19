import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class InvalidPostIdError extends Error {
  constructor(id: string) {
    super(`Invalid Post ID format: ${id}. Must be a valid UUID.`);
    this.name = 'InvalidPostIdError';
  }
}

export class PostId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!uuidValidate(value)) {
      throw new InvalidPostIdError(value);
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): PostId {
    return new PostId(value);
  }

  public static generate(): PostId {
    return new PostId(uuidv4());
  }

  public equals(other: PostId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}
