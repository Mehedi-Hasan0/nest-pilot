import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  exists(email: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}

// INJECTION TOKEN
// The Application layer will use this symbol in their Use Cases to ask NestJS for an injecting provider.
// This allows the Application layer to safely depend on an interface without caring about the concrete Infra implementation.
export const USER_REPOSITORY_PORT = Symbol('UserRepositoryPort');
