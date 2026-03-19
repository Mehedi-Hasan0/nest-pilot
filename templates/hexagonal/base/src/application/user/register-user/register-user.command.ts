export class RegisterUserCommand {
  public readonly email: string;
  public readonly name: string;
  public readonly passwordRaw: string;

  constructor(email: string, name: string, passwordRaw: string) {
    this.email = email;
    this.name = name;
    this.passwordRaw = passwordRaw;
  }
}
