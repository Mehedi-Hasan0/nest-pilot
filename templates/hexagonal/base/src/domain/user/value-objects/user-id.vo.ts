import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class InvalidUserIdError extends Error {
  constructor(id: string) {
    super(`Invalid User ID format: ${id}. Must be a valid UUID.`);
    this.name = 'InvalidUserIdError';
  }
}

export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!uuidValidate(value)) {
      throw new InvalidUserIdError(value);
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): UserId {
    return new UserId(value);
  }

  public static generate(): UserId {
    return new UserId(uuidv4());
  }

  public equals(other: UserId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}
