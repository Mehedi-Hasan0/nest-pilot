import { Email, InvalidEmailError } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw error for invalid email format', () => {
    expect(() => Email.create('invalid-email')).toThrow(InvalidEmailError);
  });

  it('should normalize email to lowercase', () => {
    const email = Email.create('TEST@EXAMPLE.COM');
    expect(email.value).toBe('test@example.com');
  });
});
