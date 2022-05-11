
// 1. Promise is getting constructed via new operator so we have to use class or constructor fn
// 2. Promise takes constructor input a function executor function which is invoked immediately
// 3. Executor function takes 2 arguments resolve & reject methods which it calls for resolving & rejecting data
//4. Resolve & Reject methods take only one argument.
//5. We have to define then method so that it is able to execute then handler
//6. Now we are executing the executor function & for getting started we want to do for synchronous resolve

//7. Covers only Synchronous Resolve
class CustomPromise{

    isResolved=false;
    resolvedData;
    constructor(executorFn)
    {
        const resolve = (value) => {
            this.isResolved=true;
            this.resolvedData=value;
        }

        const reject = (value) => {}
        executorFn(resolve,reject);
    }
    //It will happen synchronously but Promise forces its handlers to run async
    then(fn)
    {
        if(this.isResolved)
        {
            fn(this.resolvedData);
        }
    }
  
}

// const customSyncResolvepromise = new CustomPromise(
//     (resolve)=>resolve(5)
//     )
//     customSyncResolvepromise.then((val)=>console.log(val));

//8. Let's add Async When we are using setTimeout for doing resolve 
//9. As then will be called before data is resolved, 
//we have to store the then callback function and excute after it is resolved.
class CustomAsyncResolvePromise{

    isResolved=false;
    resolvedData;
    thenFn;
    constructor(executorFn)
    {
        const resolve = (value) => {
            this.isResolved=true;
            this.resolvedData=value;

            if(this.thenFn)
            {
                this.thenFn(this.resolvedData);
            }

        }

        const reject = (value) => {}
        executorFn(resolve,reject);
    }
    then(fn)
    {
        //This will be called before data is resolved because of how async works in js eventloop
        //thus we have to call it after it is resolved so we can store the function definition
        //and execute it later
        this.thenFn=fn;
        if(this.resolvedData)
        {
            this.thenFn(this.resolvedData);
        }
    }
  
}

// const customAsyncResolvepromise = new CustomAsyncResolvePromise(
//     (resolve)=> setTimeout(()=>resolve(5),1000)
//     )
// customAsyncResolvepromise.then((val)=>console.log(val));

//10. Let's handle multiple then methods.
// 11. We are returning class instance so that next then handlers can get instance
//12. Now let's first do for async operation => we will have multiple handlers to execute & we have to store them all
// so that we can execute them in order when data is resolved;
//13. For Sync it will be called after data is resolved thus, if we keep adding to our resolveChain Array
// It will call previously added handler multiple times. 
//Thus what we can do is we can pop the called function & update the resolved data

class CustomSyncAndAsyncResolveWithThenChainingPromise{

    isResolved=false;
    resolvedData;
    resolveChain=[];
    constructor(executorFn)
    {
        const resolve = (value) => {
            this.isResolved=true;
            this.resolvedData=value;
            if(this.resolveChain.length > 0)
            {
                this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            }

        }

        const reject = (value) => {}
        executorFn(resolve,reject);
    }
    then(fn)
    {
        this.resolveChain.push(fn);
        if(this.resolvedData)
        {
            this.resolvedData =  this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            this.resolveChain.shift();
            }
        //We are returning class instance so that next then handlers can get instance
        return this;
    }
  
}

const custompromiseWithChaining = new CustomSyncAndAsyncResolveWithThenChainingPromise(
    // (resolve)=> setTimeout(()=>resolve(5),1000)
    (resolve) => resolve(5)
    )
    custompromiseWithChaining.then((val)=>val*val).then((val)=>console.log(val));

//14. Let's also handle reject for that we just have to do same thing as above.
//15. we have declare same variables for  keeping track like isRejected, rejectedData, rejectChain
class CustomPromiseWithResolveAndReject{

    isResolved=false;
    resolvedData;
    resolveChain=[];

    isRejected=false;
    rejectedData;
    rejectChain=[];

    constructor(executorFn)
    {
        const resolve = (value) => {
            this.isResolved=true;
            this.resolvedData=value;
            if(this.resolveChain.length > 0)
            {
                this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            }
        }

        const reject = (value) => {
            this.isRejected=true;
            this.rejectedData=value;
            if(this.rejectChain.length > 0)
            {
                this.rejectChain.reduce((acc,fn)=> fn(acc) ,this.rejectedData );
            }
        }
        executorFn(resolve,reject);
    }
    then(fn)
    {
        this.resolveChain.push(fn);
        if(this.resolvedData)
        {
            this.resolvedData =  this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            this.resolveChain.shift();
            }
        //We are returning class instance so that next then handlers can get instance
        return this;
    }

    catch(fn)
    {
        this.rejectChain.push(fn);
        if(this.rejectedData)
        { 
            this.rejectedData =  this.rejectChain.reduce((acc,fn)=> fn(acc) ,this.rejectedData );
            this.rejectChain.shift();
            }
        //We are returning class instance so that next then handlers can get instance
        return this;
    }
  
}

// const custompromiseWithResolveAndReject = new CustomPromiseWithResolveAndReject(
//     (resolve,reject)=> setTimeout(()=>reject(5),1000)
//     // (resolve,reject) => reject("Rejected")
//     )
// custompromiseWithResolveAndReject
// .then((val)=>console.log(val))
// .catch((val)=> `Promise ${val}`)
// .catch((val)=>console.log(val));

//16. Let's add finally support

class CustomPromiseComplete{

    isResolved=false;
    resolvedData;
    resolveChain=[];

    isRejected=false;
    rejectedData;
    rejectChain=[];

    static resolve(value)
    {
        return new CustomPromiseComplete((resolve,reject)=>resolve(value))
    }

    static reject(value)
    {
        return new CustomPromiseComplete((resolve,reject)=>reject(value))
    }

    static all(promises)
    {
        if(Array.isArray(promises))
        {
            let count=promises.length;
            const results=[];

            return new CustomPromiseComplete((resolve,reject)=>{
                promises.forEach((promise,index)=>{
                    promise
                    .then((data)=>{
                        results[index]=data;
                        count--;

                        if(count==0)
                        {
                            resolve(results);
                        }

                    })
                    .catch((error)=>reject(error));
                })
            })
        }
        else{
            return new CustomPromiseComplete.reject("Pass an iterable");
        }
    }

    static any(promises)
    {
        if(Array.isArray(promises))
        {
        let count=promises.length;
        let errors=[];
           return new CustomPromiseComplete((resolve,reject)=>{
                promises.forEach((promise,index)=>{
                    promise.then((data)=>{
                        // console.log(count,data)
                        resolve(data);
                    }).catch((error)=>{
                        count--;
                        console.log(index);
                        errors[index]=error;
                        if(count===0)
                        {
                            console.log(error);
                            reject(errors);
                        }
                    })
                })
           })
        }
        else{
            return new CustomPromiseComplete.reject("Pass an iterable");
        }
    }

    static race(promises)
    {
        if(Array.isArray(promises))
        {
            //It should call resolve/reject only once.
            let  isCalled=false;
            return new CustomPromiseComplete((resolve,reject)=>{
                promises.forEach((promise)=>{
                    promise.then((data)=>{
                        if(!isCalled)
                        {
                            isCalled=true;
                            resolve(data)
                        }
                    })
                    .catch((error)=>{
                        if(!isCalled)
                        {
                            isCalled=true;
                            reject(error)
                        }
                       })
                })
            })
        }
        else{
            return new CustomPromiseComplete.reject("Pass an iterable");
        }
    }

    static allSettled(promises)
    {
        if(Array.isArray(promises))
        {
            let count=promises.length;
            const results=[];

            return new CustomPromiseComplete((resolve,reject)=>{
                promises.forEach((promise,index)=>{
                    promise
                    .then((data)=>{
                        results[index]={data,status:"resolved"};
                        count--;

                        if(count==0)
                        {
                            resolve(results);
                        }

                    })
                    .catch((error)=>{
                        results[index]={data:error,status:"rejected"};
                        count--;

                        if(count==0)
                        {
                            resolve(results);
                        }
                    });
                })
            })
        }
        else{
            return new CustomPromiseComplete.reject("Pass an iterable");
        }
    }

    constructor(executorFn)
    {
        const resolve = (value) => {
            this.isResolved=true;
            this.resolvedData=value;
            if(this.resolveChain.length > 0)
            {
                this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            }
        }

        const reject = (value) => {
            this.isRejected=true;
            this.rejectedData=value;
            if(this.rejectChain.length > 0)
            {
                this.rejectChain.reduce((acc,fn)=> fn(acc) ,this.rejectedData );
            }
        }
        executorFn(resolve,reject);
    }
    then(fn)
    {
        this.resolveChain.push(fn);
        if(this.resolvedData)
        {
            this.resolvedData =  this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            this.resolveChain.shift();
        }
        //We are returning class instance so that next then handlers can get instance
        return this;
    }

    catch(fn)
    {
        this.rejectChain.push(fn);
        if(this.rejectedData)
        { 
            this.rejectedData =  this.rejectChain.reduce((acc,fn)=> fn(acc) ,this.rejectedData );
            this.rejectChain.shift();
            }
        //We are returning class instance so that next then handlers can get instance
        return this;
    }
    finally(fn)
    {
        this.rejectChain.push(fn);
        this.resolveChain.push(fn);
        //If value is getting resolved or rejected asynchronously then it will be called later as we added to list
        //For Synchronous Case
        if(this.resolvedData)
        {
            this.resolvedData =  this.resolveChain.reduce((acc,fn)=> fn(acc) ,this.resolvedData );
            this.resolveChain.shift();
        }
        if(this.rejectedData)
        {
            this.rejectedData =  this.rejectChain.reduce((acc,fn)=> fn(acc) ,this.rejectedData );
            this.rejectChain.shift();
        }
    }
  
}

const custompromiseComplete = new CustomPromiseComplete(
    (resolve,reject)=> setTimeout(()=>resolve(4),1000)
    // (resolve,reject) => reject("Rejected")
    )
    custompromiseComplete
.then((val)=>val*val)


CustomPromiseComplete
.allSettled([custompromiseComplete,CustomPromiseComplete.resolve(5),CustomPromiseComplete.reject(2),])
.then((val)=>console.log(val))
.catch((error)=>console.log(error))
