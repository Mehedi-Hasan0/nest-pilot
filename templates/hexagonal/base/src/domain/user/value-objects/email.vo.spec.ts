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

  describe('equals', () => {
    it('should return true if both emails have the same normalized string', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('TEST@EXAMPLE.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false if emails are different', () => {
      const email1 = Email.create('foo@example.com');
      const email2 = Email.create('bar@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});
