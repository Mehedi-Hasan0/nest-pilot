export class InvalidPostTitleError extends Error {
  constructor() {
    super('A post title must be between 3 and 200 characters long.');
    this.name = 'InvalidPostTitleError';
  }
}

export class PostTitle {
  private readonly _value: string;

  private constructor(value: string) {
    const trimmed = value?.trim() || '';

    if (trimmed.length < 3 || trimmed.length > 200) {
      throw new InvalidPostTitleError();
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): PostTitle {
    return new PostTitle(value);
  }
}
