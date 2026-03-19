import { BaseEntity } from '../../common/base.entity';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { InvalidNameError, EmailAlreadySetError } from '../errors/user.errors';

export interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
}

export class User extends BaseEntity<UserId> {
  private _name: string;
  private _email: Email;
  private _passwordHash: string;

  private constructor(id: UserId, props: UserProps, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.validateName(props.name);

    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
  }

  // Factory method for creating a brand new user
  public static create(props: UserProps): User {
    const id = UserId.generate();
    return new User(id, props);
  }

  // Factory method for reconstituting an existing user from the database payload
  public static reconstitute(
    id: string,
    props: { name: string; email: string; passwordHash: string },
    createdAt: Date,
    updatedAt?: Date,
  ): User {
    return new User(
      UserId.create(id),
      {
        name: props.name,
        email: Email.create(props.email),
        passwordHash: props.passwordHash,
      },
      createdAt,
      updatedAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  public changeEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      throw new EmailAlreadySetError();
    }

    this._email = newEmail;
    this.markUpdated();
  }

  public changeName(newName: string): void {
    this.validateName(newName);
    this._name = newName;
    this.markUpdated();
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      throw new InvalidNameError(name || '');
    }
  }
}
