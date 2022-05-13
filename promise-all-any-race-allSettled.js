Promise.myAll= (promises) =>{
    if(Array.isArray(promises))
    {
        let results=[];
        let count=promises.length;
        return new Promise((resolve,reject)=>{
            
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
                .catch((error)=>{
                    reject(error);
                })
            })

        })
    }
}

Promise.myAllSettled= (promises) =>{
    if(Array.isArray(promises))
    {
        let results=[];
        let count=promises.length;
        return new Promise((resolve,reject)=>{
            
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
}

Promise.myAny= (promises) =>{
    if(Array.isArray(promises))
    {
        let errors=[];
        let count=promises.length;
        return new Promise((resolve,reject)=>{
            
            promises.forEach((promise,index)=>{
                promise
                .then((data)=>{
                    resolve(data);
                })
                .catch((error)=>{
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
}
Promise.myRace= (promises) =>{
    if(Array.isArray(promises))
    {
        let isCalled=false;
        return new Promise((resolve,reject)=>{
            
            promises.forEach((promise,index)=>{
                promise
                .then((data)=>{
                    if(!isCalled)
                    {
                        this.isCalled=true;
                        resolve(data);
                    }
                })
                .catch((error)=>{
                    if(!isCalled)
                    {
                        this.isCalled=true;
                        reject(error);
                    }
                })
            })

        })
    }
}

let resolveWithDelay = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log("Executing")
        resolve(5);
    },500)
})

let rejectWithDelay = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log("Doing");
        reject("Rejected");
    },800)
})

let promise = Promise.myRace([Promise.reject(1),Promise.reject(2),resolveWithDelay,rejectWithDelay]);
promise.then((data)=>console.log(data))
.catch((error)=>console.log(error));
