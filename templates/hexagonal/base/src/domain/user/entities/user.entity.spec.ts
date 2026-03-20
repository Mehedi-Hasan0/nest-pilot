import { User } from './user.entity';
import { Email } from '../value-objects/email.vo';
import { InvalidNameError, EmailAlreadySetError } from '../errors/user.errors';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = User.create({
      email: Email.create('test@example.com'),
      name: 'Test User',
      passwordHash: 'hashed-password',
    });
    expect(user.email.value).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should throw error for invalid name length', () => {
    expect(() => {
      User.create({
        email: Email.create('test@example.com'),
        name: 'A',
        passwordHash: 'hashed-password',
      });
    }).toThrow(InvalidNameError);
  });

  it('should reconstitute a user correctly', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const email = 'test@example.com';
    const name = 'Test User';
    const password = 'hashed-password';
    const createdAt = new Date();

    const user = User.reconstitute(id, { email, name, passwordHash: password }, createdAt);

    expect(user.id.value).toBe(id);
    expect(user.name).toBe(name);
  });

  describe('changeEmail', () => {
    it('should successfully change email when provided a new one', () => {
      const user = User.create({
        email: Email.create('old@example.com'),
        name: 'Test User',
        passwordHash: 'hashed-password',
      });

      const newEmail = Email.create('new@example.com');
      user.changeEmail(newEmail);

      expect(user.email.value).toBe('new@example.com');
    });

    it('should throw EmailAlreadySetError if changing to the exact same email', () => {
      const user = User.create({
        email: Email.create('same@example.com'),
        name: 'Test User',
        passwordHash: 'hashed-password',
      });

      const sameEmail = Email.create('same@example.com');

      expect(() => user.changeEmail(sameEmail)).toThrow(EmailAlreadySetError);
    });
  });
});
