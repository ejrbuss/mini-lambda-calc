const test = require('tape');
const { calc } = require('./golfed');

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