const readline = require('readline');
const pjson    = require('../package.json');
const { calc } = require('./mini-lambda-calc');

const repl = readline.createInterface({
    input  : process.stdin,
    output : process.stdout,
});

console.log(`mini-lambda-calculus v${pjson.version} 2018\n`);
repl.setPrompt('λ > ');
repl.prompt();

repl.on('line', line => {
    try {
        process.stdout.write(calc(line) + '\n');
    } catch(err) {
        process.stderr.write(err + '\n');
    }
    repl.prompt();
});