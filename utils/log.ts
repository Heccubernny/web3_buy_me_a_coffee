import chalk from 'chalk';
export const success = chalk.green;
export const error = chalk.red;
export const warning = chalk.yellow;
export const info = chalk.blue;

export function log( type: typeof console.log = console.log, ...inputs: any[] ) {
    console.log( type( ...inputs ) );
  }