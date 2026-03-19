import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './persistence/user.orm-entity';
import { UserRepositoryAdapter } from './persistence/user.repository.adapter';
import { USER_REPOSITORY_PORT } from '../../domain/user/ports/user.repository.port';
import { RegisterUserUseCase } from '../../application/user/register-user/register-user.use-case';
import { GetUserProfileUseCase } from '../../application/user/get-user-profile/get-user-profile.use-case';
import { UserController } from './http/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    RegisterUserUseCase,
    GetUserProfileUseCase,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepositoryAdapter,
    },
  ],
  exports: [USER_REPOSITORY_PORT, RegisterUserUseCase, GetUserProfileUseCase],
})
export class UserModule {}
