import { buildContext, toPascalCase, toConstantCase } from '../buildContext';
import { ComposerContext } from '../compose';

/** Minimal Phase 2 context to satisfy the full ComposerContext interface. */
const baseContext: ComposerContext = {
  projectName: 'my-app',
  architecture: 'hexagonal',
  packageManager: 'npm',
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: [],
  includeExampleCode: true,
};

describe('buildContext()', () => {
  it('passes projectName through unchanged', () => {
    const ctx = buildContext(baseContext);
    expect(ctx.projectName).toBe('my-app');
  });

  it('derives projectNamePascalCase correctly', () => {
    const ctx = buildContext({ ...baseContext, projectName: 'my-cool-app' });
    expect(ctx.projectNamePascalCase).toBe('MyCoolApp');
  });

  it('derives projectNameConstant correctly', () => {
    const ctx = buildContext({ ...baseContext, projectName: 'my-cool-app' });
    expect(ctx.projectNameConstant).toBe('MY_COOL_APP');
  });

  it('includes the current year', () => {
    const ctx = buildContext(baseContext);
    expect(ctx.year).toBe(new Date().getFullYear().toString());
  });

  describe('ORM & Database derivations', () => {
    it('TypeORM + PostgreSQL → pg driver', () => {
      const ctx = buildContext({ ...baseContext, orm: 'typeorm', database: 'postgresql' });
      expect(ctx.databaseDriver).toBe('pg');
      expect(ctx.databasePort).toBe(5432);
      expect(ctx.ormPackages).toContain('pg');
      expect(ctx.ormPackages).toContain('@nestjs/typeorm');
    });

    it('TypeORM + MySQL → mysql2 driver', () => {
      const ctx = buildContext({ ...baseContext, orm: 'typeorm', database: 'mysql' });
      expect(ctx.databaseDriver).toBe('mysql2');
      expect(ctx.databasePort).toBe(3306);
      expect(ctx.ormPackages).toContain('mysql2');
    });

    it('Prisma + MongoDB → mongodb driver', () => {
      const ctx = buildContext({ ...baseContext, orm: 'prisma', database: 'mongodb' });
      expect(ctx.databaseDriver).toBe('mongodb');
      expect(ctx.databasePort).toBe(27017);
      expect(ctx.ormPackages).toContain('@prisma/client');
    });

    it('MikroORM + PostgreSQL → mikroorm-postgresql', () => {
      const ctx = buildContext({ ...baseContext, orm: 'mikroorm', database: 'postgresql' });
      expect(ctx.databaseDriver).toBe('pg');
      expect(ctx.ormPackages).toContain('@mikro-orm/postgresql');
    });
  });

  describe('Auth derivations', () => {
    it('JWT → jwt packages', () => {
      const ctx = buildContext({ ...baseContext, auth: 'jwt' });
      expect(ctx.authPackages).toContain('@nestjs/jwt');
      expect(ctx.authPackages).toContain('passport-jwt');
      expect(ctx.hasAuth).toBe(true);
    });

    it('Session → session packages', () => {
      const ctx = buildContext({ ...baseContext, auth: 'session' });
      expect(ctx.authPackages).toContain('express-session');
      expect(ctx.authPackages).toContain('connect-redis');
      expect(ctx.hasAuth).toBe(true);
    });

    it('None → no auth packages', () => {
      const ctx = buildContext({ ...baseContext, auth: 'none' });
      expect(ctx.authPackages).toHaveLength(0);
      expect(ctx.hasAuth).toBe(false);
    });
  });

  describe('Optional Module booleans', () => {
    it('detects swagger correctly', () => {
      const ctx = buildContext({ ...baseContext, optionalModules: ['swagger'] });
      expect(ctx.hasSwagger).toBe(true);
    });

    it('auto-enables redis for bullmq', () => {
      const ctx = buildContext({ ...baseContext, optionalModules: ['bullmq'] });
      expect(ctx.hasBullMQ).toBe(true);
      expect(ctx.hasRedis).toBe(true);
    });

    it('detects all modules correctly', () => {
      const ctx = buildContext({
        ...baseContext,
        optionalModules: ['swagger', 'redis', 'bullmq', 'websockets'],
      });
      expect(ctx.hasSwagger).toBe(true);
      expect(ctx.hasRedis).toBe(true);
      expect(ctx.hasBullMQ).toBe(true);
      expect(ctx.hasWebSockets).toBe(true);
    });
  });
});

describe('toPascalCase()', () => {
  it('converts single word', () => expect(toPascalCase('app')).toBe('App'));
  it('converts hyphenated name', () => expect(toPascalCase('my-app')).toBe('MyApp'));
  it('converts multi-part name', () => expect(toPascalCase('my-cool-app')).toBe('MyCoolApp'));
});

describe('toConstantCase()', () => {
  it('converts single word', () => expect(toConstantCase('app')).toBe('APP'));
  it('converts hyphenated name', () => expect(toConstantCase('my-app')).toBe('MY_APP'));
  it('converts multi-part name', () => expect(toConstantCase('my-cool-app')).toBe('MY_COOL_APP'));
});
