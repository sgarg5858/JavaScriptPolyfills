<!-- Polyfill of pipe function in Functional Programming JS -->

const pipe = (functions) => {
    return function(value)
    {
        return functions.reduce((acc,fn)=>{
            return fn(acc);
        },value)
    }
}

<!-- Polyfill of Curry Function in FP JS -->

function x(a,b,c,d)
{
    return a+b+c+d;
}


function curry(fn)
{
    let arity=fn.length;
    let args=[];
    return function inner(input)
    {
        args=[...args,input];
        return args.length < arity ? inner : fn(...args);
    }
}
let curriedX =curry(x);
console.log(curriedX);
console.log(curriedX(1)(2)(3)(4))
