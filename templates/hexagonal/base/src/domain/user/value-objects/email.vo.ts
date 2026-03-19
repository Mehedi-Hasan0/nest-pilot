export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`The email address "${email}" is not properly formatted.`);
    this.name = 'InvalidEmailError';
  }
}

export class Email {
  private readonly _value: string;

  // Extremely strict domain-level email validation is historically fraught with edge cases.
  // This Regex handles 99% of normal emails reliably.
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    const normalized = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(normalized)) {
      throw new InvalidEmailError(value);
    }

    this._value = normalized;
  }

  get value(): string {
    return this._value;
  }

  public static create(value: string): Email {
    return new Email(value);
  }

  public equals(other: Email): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}
