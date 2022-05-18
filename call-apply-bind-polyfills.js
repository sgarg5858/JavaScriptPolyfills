Function.prototype.myCall = function(thisContext,...inputs)
{
    thisContext.func=this;
    thisContext.func(...inputs);
}

Function.prototype.myApply = function(thisContext,inputs)
{
    thisContext.func=this;
    thisContext.func(...inputs);
}

Function.prototype.myBind = function(thisContext,...inputs)
{
    let func= this;
    return function(...secondInputs)
    {
        func.apply(thisContext,[...inputs,...secondInputs]);
    }

}
