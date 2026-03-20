import { registerAs } from '@nestjs/config';

/**
 * Authentication configuration namespace.
 *
 * Inject with: @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>
 */
export const authConfig = registerAs('auth', () => ({
  /**
   * The secret key used to sign and verify JWTs.
   * Must be at least 32 characters long (enforced by Zod env validation).
   * Treat this like a password — never commit it to version control.
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * How long a JWT remains valid before the client must re-authenticate.
   * Accepts zeit/ms strings: '7d', '24h', '60m', etc.
   * Default: '7d' (safe for most web apps; shorten for high-security contexts).
   *
   * PRD §9: Must be configurable via environment variable.
   */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
}));
