#!/usr/bin/env node
import { Command } from 'commander';
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
