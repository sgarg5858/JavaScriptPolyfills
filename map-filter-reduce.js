
Array.prototype.myMap = function(fn)
{
    let newArray=[];
    let currentArray=this;
    for(let i=0;i<currentArray.length ;i ++)
    {
        newArray[i]=fn(currentArray[i],i,currentArray);
    }
    return newArray;
}

Array.prototype.myFilter = function(fn)
{
    let newArray=[];
    let currentArray=this;
    for(let i=0;i<currentArray.length ;i ++)
    {
       if(fn(currentArray[i]))
       {
           newArray.push(currentArray[i]);
       }
    }
    return newArray;
}

Array.prototype.myReduce = function(fn,initialValue)
{
    let index=0;
    let currentArray=this;
    let acc;
    if(initialValue === undefined)
    {
        acc=currentArray[0];
        index++;
    }
    for(let i=index;i<currentArray.length ;i ++)
    {
      acc = fn(acc,currentArray[i],i,currentArray);
    }
    return acc;
}
