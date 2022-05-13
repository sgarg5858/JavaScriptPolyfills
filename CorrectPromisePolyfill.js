

//0. Constructor function takes one function as input & it calls it immediately with 2 parameters
//Paramters are callback functions one for resolve & one for reject & both take one argument to resolve & reject respectively.
// 1. Consider When Executor Function excecutes synchnously
// 2. Consider When Executor Function excecutes asynchnously => for this we need to store then callback to execute later
// 3. To get started only consider resolve case
//4. Then handler will be a function right which will take resolved value.


class MyPromise{

    isResolved = false;
    isRejected = false;

    resolvedData;
    rejectedData;

    thenChain=[];
    catchChain=[];

    static resolve(val)
    {
        return new MyPromise((resolve,reject)=>resolve(val));
    }

    static reject(val)
    {
       return  new MyPromise((resolve,reject)=>reject(val));
    }
    static all(promises)
    {
        if(Array.isArray(promises))
        {
            let results=[];
            let count=promises.length;

            return new MyPromise((resolve,reject)=>{

                promises.forEach((promise,index)=>{
                    promise.then((data)=>
                    {
                        results[index]=data;
                        count--;
                        if(count==0)
                        {
                            resolve(results);
                        }
                    }).catch((error)=>{
                        reject(error);
                    })
                })
            })
        }
        else
        {
            throw new Error("Pass Array or Iterable of Promises");
        }
    }

    static race(promises)
    {
        if(Array.isArray(promises))
        {
            let calledResolveRejectOnce=false;
            return new MyPromise((resolve,reject)=>{

                promises.forEach((promise)=>{
                    promise.then((data)=> {  
                        if(!calledResolveRejectOnce)
                        {
                            this.calledResolveRejectOnce=true;
                            resolve(data);
                        }
                    })
                    .catch((error)=>{
                        if(!calledResolveRejectOnce)
                        {
                            this.calledResolveRejectOnce=true;
                            reject(error);
                        }
                    });
                })

            })
        }
        else
        {
            throw new Error("Pass Array or Iterable of Promises");
        }
    }

    static any(promises)
    {
        if(Array.isArray(promises))
        {
            let errors=[];
            let count=promises.length;
            return new MyPromise((resolve,reject)=>{

                promises.forEach((promise,index)=>{
                    promise
                    .then((data)=>{
                        resolve(data);
                    }).catch((error)=>{
                        errors[index]=error;
                        count--;
                        if(count==0)
                        {
                            reject(errors);
                        }
                    })
                })

            })
        }
        else
        {
            throw new Error("Pass Array or Iterable of Promises");
        }
    }

    static allSettled(promises)
    {
        if(Array.isArray(promises))
        {
            let results=[];
            let count=promises.length;
            return new MyPromise((resolve,reject)=>{

                promises.forEach((promise,index)=>{
                    promise.then((data)=>{
                        results[index]=data;
                        count--;
                        if(count==0)
                        {
                            console.log("Hey")
                            resolve(results);
                        }
                    })
                    .catch((error)=>{
                        results[index]=error;
                        count--;
                        if(count==0)
                        {
                            resolve(results);
                        }
                    })
                })

            })
        }
        else
        {
            throw new Error("Pass Array or Iterable of Promises");
        }
    }

    constructor(executorFn){

        const resolve = (val) =>{

            if(!this.isResolved && !this.isRejected)
            {
                this.resolvedData=val;
                this.isResolved=true;

               queueMicrotask(()=>{
                if(this.thenChain.length > 0)
                {
                    this.thenChain.reduce((acc,fn)=>fn(acc),this.resolvedData);
                }
               })
            }
        }
        const reject = (val) => {
            if(!this.isResolved && !this.isRejected)
            {
                this.rejectedData=val;
                this.isRejected=true;
                
                queueMicrotask(()=>{

                    if(this.catchChain.length > 0)
                {
                    this.catchChain.reduce((acc,fn)=>fn(acc),this.rejectedData);
                }
                })
            }
        }
        executorFn(resolve,reject);
    }

    then(fn) {
        this.thenChain.push(fn);
        console.log(this.thenChain);

        return this;
    }
    catch(fn)
    {
            this.catchChain.push(fn);
            return this;
    }
    finally(fn)
    {
        this.thenChain.push(fn);
        this.catchChain.push(fn);
    }
}

let mypromise = new MyPromise( (resolve,reject)=>
{
    setTimeout(()=>reject(10),1000)
}) 
mypromise
.then((val)=>val*val)
.catch((error)=>`${error}`)
.finally((data)=>{console.log(data); return data});

mypromise
.then((val)=>val*val)
.catch((error)=>`${error}`)
.finally((data)=>console.log(data));



for(let i=0;i<10;i++)
{
    console.log(i)
}
