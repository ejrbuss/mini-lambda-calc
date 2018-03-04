const readline = require('readline');
const pjson    = require('../package.json');
const { calc } = require('./mini-lambda-calc');

const repl = readline.createInterface({
    input  : process.stdin,
    output : process.stdout,
});

let debugging = false;
const extensions = [];
repl.load = (path) => {
    process.stdout.write('loading ' + path + '...');
    extensions.unshift(require(path)((src, ext=[]) =>
        calc(src, ext.concat(extensions))));
    process.stdout.write('done\n');
};

process.stdout.write(`extended-mini-lambda-calculus v${pjson.version} 2018\n\n`);

// Load out default extensions here
repl.load('../extensions/prelude.ext');
repl.load('../extensions/history.ext');
process.stdout.write('\n');

repl.setPrompt('λ > ');
repl.prompt();
repl.on('line', line => {
    if (/:quit|:q/.test(line)) {
        process.stdout.write('Bye!');
        process.exit();
    } else if (/:load|:l/.test(line)) {
        process.stdout.write('TODO!');
        // dynamically load extension
    } else if (/:debug|:d/.test(line)) {
        if(debugging) {
            extensions.pop();
        } else {
            repl.load('../extensions/debug.ext');
            extensions.push(extensions.shift());
            debugging = true;
        }
    } else {
        try {
            process.stdout.write(calc(line, extensions) + '\n');
        } catch(err) {
            process.stderr.write(err.stack + '\n');
        }
    }
    repl.prompt();
});