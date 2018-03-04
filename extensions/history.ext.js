const { Var, App } = require('../extended/mini-lambda-calc');

module.exports = calc => ({
    in  : term => App(App(Var('def'), Var('%')), term),
    out : x => x,
});