// #!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { Command, CompletionsCommand, parse } from './deps.ts';

import { set } from './commands/index.ts';

import { getConfig } from './config/index.ts';
import { DEFAULT_CONFIG, PROGRAM_NAME } from './utils/constants.ts';

const config = await getConfig(
  DEFAULT_CONFIG,
  parse(Deno.args, {
    boolean: ['dev', 'force', 'help', 'verbose'],
    alias: {
      cfg: 'config',
      file: 'f',
      help: 'h',
      verbose: 'v',
    },
  }),
);

const program = new Command();
program
  .name(PROGRAM_NAME)
  .version('0.1.0')
  .description('Describe the program.')
  .globalOption('--dev', 'Run in development mode.')
  .globalOption('--cfg, --config <cfgFile>', 'Configuration file to use.', {
    default: DEFAULT_CONFIG,
  })
  .globalOption('--force', 'Take action without confirmation.', {
    default: false,
  })
  .globalOption(
    '-f, --file <file>',
    "The file to act upon. Defaults to reconfiger's own config file.",
    {
      default: DEFAULT_CONFIG,
    },
  )
  .globalOption('-v, --verbose', 'Provides verbose logging.')
  .globalComplete('keys', () => {
    // return array of completions consume the completion by specifying
    // its name on arguments
    return [];
  })
  .globalComplete('values', () => {
    // return array of completions consume the completion by specifying
    // its name on arguments
    return [];
  })
  // set subcommand
  .command('s, set <key> <value>', 'Sets <key> to the given <value>.')
  .arguments('<keys:string:keys> <value:string:values>')
  .action((options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    set(options, args);
  });

await program.command('completions', new CompletionsCommand()).parse(Deno.args);
