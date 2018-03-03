const test   = require('tape');
const { calc, lex, parse, reduce, str } = require('./mini-lambda-calc');

test('lex', $ => {
    $.plan(3);
    $.deepEqual(lex('((λ x. x) (λ y. (λ z. z)))'),
        ['(', '(λ', 'x', 'x', '(λ', 'y', '(λ', 'z', 'z']
    );
    $.deepEqual(lex('(λ x. ((λ y. y) x))'),
        ['(λ', 'x', '(', '(λ', 'y', 'y', 'x']
    );
    $.deepEqual(lex('((λ x. (λ y. x)) (λ a. a))'),
        ['(', '(λ', 'x', '(λ', 'y', 'x', '(λ', 'a', 'a']
    );
});

test('parse', $ => {
    $.plan(3);
    $.deepEqual(
        parse(lex('((λ x. x) (λ y. (λ z. z)))')),
        {
            M : {
                x : { x : 'x', Var : true },
                M : { x : 'x', Var : true },
                Lambda : true,
            },
            N : {
                x : { x : 'y', Var : true },
                M : {
                    x : { x : 'z', Var : true },
                    M : { x : 'z', Var : true },
                    Lambda : true,
                },
                Lambda : true,
            },
            App : true,
        }
    );
    $.deepEqual(
        parse(lex('(λ x. ((λ y. y) x))')),
        {
            x : { x : 'x', Var : true },
            M : {
                M : {
                    x : { x : 'y', Var : true },
                    M : { x : 'y', Var : true },
                    Lambda : true,
                },
                N : { x : 'x', Var : true },
                App : true,
            },
            Lambda : true,
        }
    );
    $.deepEqual(
        parse(lex('((λ x. (λ y. x)) (λ a. a))')),
        {
            M : {
                x : { x : 'x', Var : true },
                M : {
                    x : { x : 'y', Var : true },
                    M : { x : 'x', Var : true },
                    Lambda : true,
                },
                Lambda : true,
            },
            N : {
                x : { x : 'a', Var : true },
                M : { x : 'a', Var : true},
                Lambda : true,
            },
            App : true,
        }
    );
});

test('str', $ => {
    $.plan(9);
    $.equal(
        str(parse(lex('((λ x. x) (λ y. (λ z. z)))'))),
        '((λ x. x) (λ y. (λ z. z)))'
    );
    $.equal(
        str(parse(lex('(λ x. ((λ y. y) x))'))),
        '(λ x. ((λ y. y) x))'
    );
    $.equal(
        str(parse(lex('((λ x. (λ y. x)) (λ a. a))'))),
        '((λ x. (λ y. x)) (λ a. a))'
    );
    $.equal(
        str(parse(lex('(((λ x. (λ y. x)) (λ a. a)) (λ b. b))'))),
        '(((λ x. (λ y. x)) (λ a. a)) (λ b. b))'
    );
    $.equal(
        str(parse(lex('((λ x. (λ y. y)) (λ a. a))'))),
        '((λ x. (λ y. y)) (λ a. a))'
    );
    $.equal(
        str(parse(lex('(((λ x. (λ y. y)) (λ a. a)) (λ b. b))'))),
        '(((λ x. (λ y. y)) (λ a. a)) (λ b. b))'
    );
    $.equal(
        str(parse(lex('((λ x. (x x)) (λ x. (x x)))'))),
        '((λ x. (x x)) (λ x. (x x)))'
    );
    $.equal(
        str(parse(lex('(((λ x. (λ y. x)) (λ a. a)) ((λ x. (x x)) (λ x. (x x))))'))),
        '(((λ x. (λ y. x)) (λ a. a)) ((λ x. (x x)) (λ x. (x x))))'
    );
    $.equal(
        str(parse(lex('((λ a. (λ b. (a (a (a b))))) (λ c. (λ d. (c (c d)))))'))),
        '((λ a. (λ b. (a (a (a b))))) (λ c. (λ d. (c (c d)))))'
    );
});

test('calc', $ => {
    $.plan(9);
    $.equal(
        calc('((λ x. x) (λ y. (λ z. z)))'),
        '(λ y. (λ z. z))'
    );
    $.equal(
        calc('(λ x. ((λ y. y) x))'),
        '(λ x. x)'
    );
    $.equal(
        calc('((λ x. (λ y. x)) (λ a. a))'),
        '(λ y. (λ a. a))'
    );
    $.equal(
        calc('(((λ x. (λ y. x)) (λ a. a)) (λ b. b))'),
        '(λ a. a)'
    );
    $.equal(
        calc('((λ x. (λ y. y)) (λ a. a))'),
        '(λ y. y)'
    );
    $.equal(
        calc('(((λ x. (λ y. y)) (λ a. a)) (λ b. b))'),
        '(λ b. b)'
    );
    $.equal(
        calc('(((λ x. (λ y. x)) (λ a. a)) ((λx. (x x)) (λx. (x x))))'),
        '(λ a. a)'
    );
    $.equal(
        calc('((λ a. (λ b. (a (a (a b))))) (λ c. (λ d. (c (c d)))))'),
        '(λ b. (λ d\'. (b (b (b (b (b (b (b (b d\'))))))))))'
    );
    $.equal(
        calc('((λ f. (λ x. (f x))) (λ y. (λ x. y)))'),
        '(λ x. (λ x\'. x))'
    );
});