import { registerAs } from '@nestjs/config';

/**
 * Application-level configuration namespace.
 *
 * Inject with: @Inject(appConfig.KEY) private readonly config: ConfigType<typeof appConfig>
 *
 * Why `registerAs`?
 * It namespaces config keys to avoid collisions and provides type-safe access
 * via ConfigService.get('app.port') or ConfigType<typeof appConfig>.
 * Controllers and services must never call process.env directly — always use this.
 */
export const appConfig = registerAs('app', () => ({
  /**
   * The port the HTTP server listens on.
   * Default: 3000 (safe for local dev; override in prod via environment).
   */
  port: parseInt(process.env.PORT ?? '3000', 10),

  /**
   * The Node environment. Controls things like Swagger availability and DB sync.
   */
  nodeEnv: process.env.NODE_ENV ?? 'development',

  /**
   * CORS origin allowed to access this API.
   * Use '*' only in development. In production, set to your frontend's exact origin.
   */
  corsOrigin: process.env.APP_CORS_ORIGIN ?? '*',
}));
