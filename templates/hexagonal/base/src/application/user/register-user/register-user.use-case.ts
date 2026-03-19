import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserCommand } from './register-user.command';
import { UserResponseDto } from '../common/user-response.dto';
import { User } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { EmailAlreadyInUseError } from '../../../domain/user/errors/user.errors';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../../domain/user/ports/user.repository.port';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    // 1. Delegate validation to Domain Value Objects
    const email = Email.create(command.email);

    // 2. Enforce cross-entity invariants via Port
    const exists = await this.userRepository.exists(email.value);
    if (exists) {
      throw new EmailAlreadyInUseError(email.value);
    }

    // 3. Orchestrate password hashing
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(command.passwordRaw, saltRounds);

    // 4. Create pure Domain Entity
    const user = User.create({
      name: command.name,
      email: email,
      passwordHash: passwordHash,
    });

    // 5. Persist via Port
    await this.userRepository.save(user);

    // 6. Return mapped DTO, NEVER the Domain Entity explicitly
    return UserResponseDto.fromEntity(user);
  }
}
