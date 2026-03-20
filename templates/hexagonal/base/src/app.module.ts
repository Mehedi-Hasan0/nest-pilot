import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './infrastructure/common/config/env.validation';
import { AuthModule } from './infrastructure/common/auth/auth.module';
import { UserModule } from './infrastructure/user/user.module';
import { PostModule } from './infrastructure/post/post.module';
import { CommentModule } from './infrastructure/comment/comment.module';

@Module({
  imports: [
    // Configuration — must be first so all other modules can inject ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    // Database — configured async so it can inject ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        // Never synchronize in production — use migrations instead
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // Authentication — wires JwtModule, PassportModule, JwtStrategy, and the global JwtAuthGuard.
    // All routes are protected by default; use @Public() to opt specific routes out.
    AuthModule,

    // Domain Feature Modules
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
