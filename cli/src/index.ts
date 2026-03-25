#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

// Node version check (v18+)
// PRD-02 §11.1 Scenario 7
const nodeVersion = parseInt(process.version.slice(1).split('.')[0], 10);
if (nodeVersion < 18) {
  console.error(
    chalk.red(`✖ Node.js v18 or higher is required. You are running ${process.version}.`),
  );
  process.exit(1);
}

import { createCommand } from './commands/create.command';

const program = new Command();

program
  .name('nest-pilot')
  .description('Interactive CLI for generating production-ready NestJS projects')
  .version('0.1.0');

program.addCommand(createCommand());

// Stub commands for future phases
program
  .command('add [feature]')
  .description('Add a feature to an existing project (coming soon)')
  .action(() => {
    console.log('The "add" command is coming in a future release.');
  });

program.parse(process.argv);
