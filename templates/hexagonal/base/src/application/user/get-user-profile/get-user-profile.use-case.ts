import { Injectable, Inject } from '@nestjs/common';
import { UserResponseDto } from '../common/user-response.dto';
import { UserNotFoundError } from '../../../domain/user/errors/user.errors';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../../domain/user/ports/user.repository.port';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  public async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return UserResponseDto.fromEntity(user);
  }
}
