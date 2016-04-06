var chalk = require('chalk');
var program = require('commander');
var envs = require('./env');
var vidispine = require('./vidispine');

program
.version('0.0.1')
.option('-e, --environment [value]', 'Set the environment')
.parse(process.argv);

if (!program.environment) {
  console.log(chalk.red('Missing --environment parametter.'));
  return;
}

var env = envs[program.environment];

console.log('The storages checker will run on this environment -> ' + chalk.green(env.host));

vidispine.checkStorages(env);

