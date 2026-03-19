import { User } from '../../../domain/user/entities/user.entity';

export class UserResponseDto {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly createdAt: Date;

  constructor(id: string, email: string, name: string, createdAt: Date) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
  }

  /**
   * Static factory method to map from a pure Domain Entity to a plain DTO.
   * This ensures the presentation/infrastructure layers never handle domain objects directly.
   */
  public static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(user.id.value, user.email.value, user.name, user.createdAt);
  }
}
