export class InvalidPostContentError extends Error {
  constructor() {
    super('A post content must be at least 10 characters long.');
    this.name = 'InvalidPostContentError';
  }
}

export class PostContent {
  private readonly _value: string;

  private constructor(value: string) {
    const trimmed = value?.trim() || '';

    if (trimmed.length < 10) {
      throw new InvalidPostContentError();
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): PostContent {
    return new PostContent(value);
  }
}
