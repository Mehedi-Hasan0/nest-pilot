import { registerAs } from '@nestjs/config';

/**
 * Database configuration namespace.
 *
 * Inject with: @Inject(databaseConfig.KEY) private readonly config: ConfigType<typeof databaseConfig>
 *
 * The URL-first approach is used here (DATABASE_URL) because it is the standard
 * for cloud providers (Heroku, Railway, Render, Supabase) and avoids managing
 * separate host/port/user/password variables in the environment.
 */
export const databaseConfig = registerAs('database', () => ({
  /**
   * Full PostgreSQL connection URL.
   * Format: postgres://user:password@host:port/dbname
   * Required — the app will refuse to start without it (enforced by Zod env validation).
   */
  url: process.env.DATABASE_URL,

  /**
   * Whether to auto-synchronise the TypeORM schema with your entities.
   * MUST be false in production to prevent accidental data loss.
   * Safe to enable in development only.
   */
  synchronize: process.env.NODE_ENV !== 'production',
}));
