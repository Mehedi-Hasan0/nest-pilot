import {
  intro,
  text,
  select,
  multiselect,
  confirm,
  note,
  outro,
  cancel,
  isCancel,
} from '@clack/prompts';

export interface CreateAnswers {
  projectName: string;
  architecture: 'hexagonal' | 'ddd' | 'modular';
  includeExampleCode: boolean;
  orm: 'typeorm' | 'prisma' | 'mikroorm';
  database: 'postgresql' | 'mysql' | 'mongodb';
  auth: 'jwt' | 'session' | 'none';
  optionalModules: Array<'swagger' | 'redis' | 'bullmq' | 'websockets'>;
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

/**
 * Default selections used when --defaults flag is passed.
 * Matches PRD-02 §10: Hexagonal, TypeORM, PostgreSQL, JWT, npm.
 */
const DEFAULTS: Omit<CreateAnswers, 'projectName'> = {
  architecture: 'hexagonal',
  includeExampleCode: true,
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: [],
  packageManager: 'npm',
};

/**
 * Runs the Phase 2 prompt flow.
 *
 * Five steps: Project Setup → Database & ORM → Authentication →
 * Optional Modules → Developer Experience → Confirmation Summary.
 *
 * PRD-02 §4.1–4.4
 */
export async function runCreatePrompts(
  projectNameArg: string | undefined,
  useDefaults: boolean,
): Promise<CreateAnswers | null> {
  intro('NestJS Pilot — Project Generator  v0.2.0');

  // ─── Step 1: Project Setup ───────────────────────────────────────────────

  let projectName: string;

  if (projectNameArg) {
    projectName = projectNameArg;
  } else {
    const nameResult = await text({
      message: 'What is your project name?',
      placeholder: 'my-app',
      validate: (value) => {
        if (!value.trim()) return 'Project name is required.';
        if (!/^[a-z][a-z0-9-]*$/.test(value.trim())) {
          return 'Project name must be lowercase with hyphens only (e.g., my-app).';
        }
      },
    });

    if (isCancel(nameResult)) {
      cancel('Operation cancelled.');
      return null;
    }
    projectName = (nameResult as string).trim();
  }

  // Fast-path: --defaults skips all remaining prompts
  if (useDefaults) {
    return { projectName, ...DEFAULTS };
  }

  // --- Architecture ---
  const architectureResult = await select({
    message: 'What architecture do you want to use?',
    options: [
      {
        value: 'hexagonal',
        label: 'Hexagonal (Ports & Adapters)',
        hint: 'Isolates business logic from frameworks and databases. Best for: complex domains, high testability.',
      },
      {
        value: 'ddd',
        label: 'Domain-Driven Design (DDD)',
        hint: 'coming in v0.3',
      },
      {
        value: 'modular',
        label: 'Modular Architecture',
        hint: 'coming in v0.4',
      },
    ],
  });

  if (isCancel(architectureResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const architecture = architectureResult as CreateAnswers['architecture'];

  // --- Include example code? ---
  const includeExampleResult = await confirm({
    message: 'Include example domain code (Blog platform)?',
    initialValue: true,
    active: 'Yes, include examples (recommended for learning)',
    inactive: 'No, generate a clean structure only',
  });

  if (isCancel(includeExampleResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const includeExampleCode = includeExampleResult as boolean;

  // ─── Step 2: Database & ORM ──────────────────────────────────────────────

  const ormResult = await select({
    message: 'Which ORM would you like to use?',
    options: [
      {
        value: 'typeorm',
        label: 'TypeORM',
        hint: 'NestJS-native, decorator-based, widely used',
      },
      {
        value: 'prisma',
        label: 'Prisma',
        hint: 'Schema-first, excellent DX, generated client',
      },
      {
        value: 'mikroorm',
        label: 'MikroORM',
        hint: 'Unit-of-work pattern, flexible',
      },
    ],
  });

  if (isCancel(ormResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const orm = ormResult as CreateAnswers['orm'];

  // --- Database --- (MongoDB disabled for TypeORM per PRD §4.3)
  const databaseOptions = [
    { value: 'postgresql', label: 'PostgreSQL', hint: 'recommended' },
    { value: 'mysql', label: 'MySQL' },
    ...(orm !== 'typeorm'
      ? [{ value: 'mongodb', label: 'MongoDB' }]
      : [
          {
            value: 'mongodb-disabled',
            label: 'MongoDB',
            hint: 'not available with TypeORM',
          },
        ]),
  ];

  const databaseResult = await select({
    message: 'Which database?',
    options: databaseOptions.filter((o) => o.value !== 'mongodb-disabled'),
  });

  if (isCancel(databaseResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const database = databaseResult as CreateAnswers['database'];

  // ─── Step 3: Authentication ──────────────────────────────────────────────

  const authResult = await select({
    message: 'What authentication strategy do you want?',
    options: [
      {
        value: 'jwt',
        label: 'JWT (Bearer token)',
        hint: 'Stateless, standard for APIs',
      },
      {
        value: 'session',
        label: 'Session-based',
        hint: 'Stateful, requires Redis',
      },
      {
        value: 'none',
        label: 'None',
        hint: "I'll add auth later",
      },
    ],
  });

  if (isCancel(authResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const auth = authResult as CreateAnswers['auth'];

  // ─── Step 4: Optional Modules ────────────────────────────────────────────

  const optionalResult = await multiselect({
    message: 'Which optional modules do you want to include?',
    options: [
      {
        value: 'swagger',
        label: 'Swagger / OpenAPI',
        hint: 'API documentation UI',
      },
      {
        value: 'redis',
        label: 'Redis Cache',
        hint: '@nestjs/cache-manager + ioredis',
      },
      {
        value: 'bullmq',
        label: 'BullMQ Queues',
        hint: 'Background job processing (auto-includes Redis)',
      },
      {
        value: 'websockets',
        label: 'WebSockets',
        hint: '@nestjs/websockets + socket.io',
      },
    ],
    required: false,
  });

  if (isCancel(optionalResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  let optionalModules = (optionalResult as CreateAnswers['optionalModules']) ?? [];

  // Auto-include Redis when Session auth or BullMQ is selected
  if (
    (auth === 'session' || optionalModules.includes('bullmq')) &&
    !optionalModules.includes('redis')
  ) {
    optionalModules = ['redis', ...optionalModules];
  }

  // ─── Step 5: Developer Experience ───────────────────────────────────────

  const packageManagerResult = await select({
    message: 'Which package manager do you prefer?',
    options: [
      { value: 'npm', label: 'npm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'pnpm', label: 'pnpm' },
    ],
  });

  if (isCancel(packageManagerResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  const packageManager = packageManagerResult as CreateAnswers['packageManager'];

  // ─── Confirmation Summary ────────────────────────────────────────────────

  const summaryLines = [
    `  Project name    ${projectName}`,
    `  Architecture    ${formatArchitecture(architecture)}`,
    `  ORM             ${formatOrm(orm)}`,
    `  Database        ${formatDatabase(database)}`,
    `  Auth            ${formatAuth(auth)}`,
    `  Optional        ${optionalModules.length > 0 ? optionalModules.join(', ') : 'none'}`,
    `  Examples        ${includeExampleCode ? 'Yes' : 'No'}`,
    `  Package mgr     ${packageManager}`,
  ];

  note(summaryLines.join('\n'), 'Review your selections');

  const shouldGenerate = await confirm({
    message: `Generate project?`,
    active: `Yes, create ${projectName}`,
    inactive: 'No, go back and change something',
    initialValue: true,
  });

  if (isCancel(shouldGenerate) || !shouldGenerate) {
    cancel('Generation cancelled.');
    return null;
  }

  outro(`Creating ${projectName}...`);

  return {
    projectName,
    architecture,
    includeExampleCode,
    orm,
    database,
    auth,
    optionalModules,
    packageManager,
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatArchitecture(arch: string): string {
  const map: Record<string, string> = {
    hexagonal: 'Hexagonal (Ports & Adapters)',
    ddd: 'Domain-Driven Design (DDD)',
    modular: 'Modular Architecture',
  };
  return map[arch] ?? arch;
}

function formatOrm(orm: string): string {
  const map: Record<string, string> = {
    typeorm: 'TypeORM',
    prisma: 'Prisma',
    mikroorm: 'MikroORM',
  };
  return map[orm] ?? orm;
}

function formatDatabase(db: string): string {
  const map: Record<string, string> = {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    mongodb: 'MongoDB',
  };
  return map[db] ?? db;
}

function formatAuth(auth: string): string {
  const map: Record<string, string> = {
    jwt: 'JWT (Bearer token)',
    session: 'Session-based',
    none: 'None',
  };
  return map[auth] ?? auth;
}
