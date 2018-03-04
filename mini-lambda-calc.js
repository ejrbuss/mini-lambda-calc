const calc = src => {
    if(!src) {
        throw "Syntax Error: empty string";
    }
    return str(reduce(parse(lex(src))));
};

const Var    = (x)    => ({ x,    Var    : true });
const App    = (M, N) => ({ M, N, App    : true });
const Lambda = (x, M) => ({ x, M, Lambda : true });

const lex = source => source
    .match(/\(\\|\(λ|\.|\(|\)|\w+'*|\s+/g)
    .filter(t => !/\.|\s+|\)/.test(t));

const parse = toks => {
    const tok = toks.shift();
    if (/\w+'*/.test(tok))    { return Var(tok); }
    if (/\(\\|\(λ/.test(tok)) { return Lambda(Var(toks.shift()), parse(toks)); }
    if (/\(/.test(tok))       { return App(parse(toks), parse(toks)); }
    throw "Syntax Error: unexpected token " + tok;
};

const reduce = term => reduceByValue(reduceByName(term));

const reduceByName = term => {
    if (term.App) { return apply(reduce(term.M), term.N); }
    return term;
};

const reduceByValue = term => {
    if (term.Var)    { return term; }
    if (term.App)    { return apply(reduce(term.M), reduce(term.N)); }
    if (term.Lambda) { return Lambda(term.x, reduce(term.M)); }
};

const apply = (M, N) => {
    if (M.Lambda) { return reduce(sub({ [M.x.x] : N }, M.M)); }
    return App(M, N);
};

const sub = (map, term) => {
    if (term.Var)    { return map[term.x] || term; }
    if (term.App)    { return App(sub(map, term.M), sub(map, term.N)); }
    if (term.Lambda) {
        let xp = term.x;
        while (contains(map[Object.keys(map)[0]], xp.x)) {
            xp = Var(xp.x + '\'');
        }
        return Lambda(xp, sub(map, sub({ [term.x.x] : xp }, term.M)));
    }
};

const contains = (term, x) => {
    if (term.Var)    { return term.x === x }
    if (term.App )   { return contains(term.M, x) || contains(term.N, x); }
    if (term.Lambda) { return contains(term.M, x); }
};

const str = term => {
    if (term.Var)    { return term.x; }
    if (term.App)    { return `(${str(term.M)} ${str(term.N)})`; }
    if (term.Lambda) { return `(λ ${str(term.x)}. ${str(term.M)})`; }
    throw "Print Error: unexpected form " + term;
};

module.exports = { calc, lex, parse, reduce, str };