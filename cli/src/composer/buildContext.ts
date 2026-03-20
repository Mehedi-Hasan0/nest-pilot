import { ComposerContext } from './compose';

export interface EjsContext extends Record<string, unknown> {
  // Phase 0
  projectName: string;
  projectNamePascalCase: string;
  projectNameConstant: string;
  packageManager: string;
  architecture: string;
  year: string;

  // Phase 2 — direct
  orm: string;
  database: string;
  auth: string;
  includeExampleCode: boolean;

  // Phase 2 — derived
  databaseDriver: string;
  databasePort: number;
  ormPackages: string[];
  authPackages: string[];
  hasSwagger: boolean;
  hasRedis: boolean;
  hasBullMQ: boolean;
  hasWebSockets: boolean;
  hasAuth: boolean;
}

/**
 * Derives all EJS template variables from the raw user answers.
 *
 * This is the single source of truth for template variable derivation.
 * No logic is allowed inside .ejs templates — only variable references.
 *
 * PRD-02 §5.3
 */
export function buildContext(answers: ComposerContext): EjsContext {
  const { orm, database, auth, optionalModules = [] } = answers;

  let databaseDriver = '';
  let databasePort = 5432;
  let ormPackages: string[] = [];

  if (orm === 'typeorm') {
    ormPackages = ['typeorm', '@nestjs/typeorm', 'uuid'];
    if (database === 'postgresql') {
      databaseDriver = 'pg';
      ormPackages.push('pg');
    } else if (database === 'mysql') {
      databaseDriver = 'mysql2';
      databasePort = 3306;
      ormPackages.push('mysql2');
    }
  } else if (orm === 'prisma') {
    ormPackages = ['@prisma/client'];
    if (database === 'postgresql') {
      databaseDriver = 'pg';
    } else if (database === 'mysql') {
      databaseDriver = 'mysql2';
      databasePort = 3306;
    } else if (database === 'mongodb') {
      databaseDriver = 'mongodb';
      databasePort = 27017;
    }
  } else if (orm === 'mikroorm') {
    ormPackages = ['@mikro-orm/core', '@mikro-orm/nestjs'];
    if (database === 'postgresql') {
      databaseDriver = 'pg';
      ormPackages.push('@mikro-orm/postgresql');
    } else if (database === 'mysql') {
      databaseDriver = 'mysql2';
      databasePort = 3306;
      ormPackages.push('@mikro-orm/mysql');
    } else if (database === 'mongodb') {
      databaseDriver = 'mongodb';
      databasePort = 27017;
      ormPackages.push('@mikro-orm/mongodb');
    }
  }

  let authPackages: string[] = [];
  if (auth === 'jwt') {
    authPackages = ['@nestjs/passport', 'passport', 'passport-jwt', '@nestjs/jwt', 'bcrypt'];
  } else if (auth === 'session') {
    authPackages = ['express-session', 'passport-local', 'connect-redis', 'ioredis'];
  }

  return {
    projectName: answers.projectName,
    projectNamePascalCase: toPascalCase(answers.projectName),
    projectNameConstant: toConstantCase(answers.projectName),
    packageManager: answers.packageManager,
    architecture: answers.architecture,
    year: new Date().getFullYear().toString(),

    // Phase 2 — direct
    orm,
    database,
    auth,
    includeExampleCode: answers.includeExampleCode,

    // Phase 2 — derived
    databaseDriver,
    databasePort,
    ormPackages,
    authPackages,
    hasSwagger: optionalModules.includes('swagger'),
    hasRedis: optionalModules.includes('redis'),
    hasBullMQ: optionalModules.includes('bullmq'),
    hasWebSockets: optionalModules.includes('websockets'),
    hasAuth: auth !== 'none',
  };
}

/**
 * Converts a kebab-case project name to PascalCase.
 * Example: "my-cool-app" → "MyCoolApp"
 */
export function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Converts a kebab-case project name to CONSTANT_CASE.
 * Example: "my-cool-app" → "MY_COOL_APP"
 */
export function toConstantCase(name: string): string {
  return name.toUpperCase().replace(/-/g, '_');
}
