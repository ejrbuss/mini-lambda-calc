const { calc, lex, parse, Var, App, Lambda } = require('../extended/mini-lambda-calc');
const _ = Var('_');

const env = {
    'id'    : parse(lex('(\\x.x)')),
    'true'  : parse(lex('(\\t f.t)')),
    'false' : parse(lex('(\\t f.f)')),
    '?'     : parse(lex('(\\b.(b true false))')),
    'if'    : parse(lex('(\\c t e.(c t e))')),
};

module.exports = calc => {
    const reduce = term => {
        if (term.Var) {
            return env[term.x] || term;
        }
        if (term.App) {
            if (term.M.M && term.M.M.Var && term.M.M.x === 'def') {
                if (!term.M.N.Var) { throw new Error('Syntax Error: def expects a name'); }
                env[term.M.N.x] = reduce(term.N);
                return reduce(term.N);
            }
            return App(reduce(term.M), reduce(term.N));
        }
        if (term.Lambda) {
            if(env[term.x.x]) {
                return term;
            } else {
                return Lambda(term.x, redce(term.M));
            }
        }
    };
    return {
        in  : reduce,
        out : x => x,
    };
};