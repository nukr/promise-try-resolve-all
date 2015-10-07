let promise1 = (t) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, t)
  })
}
let promise2 = Promise.reject(2)
let promise3 = Promise.resolve(3)

async function TryResolveAllPromiseSerially (arrayOfPromise, resolve, reject) {
  let result = []
  for (var i = 0, len = arrayOfPromise.length; i < len; i++) {
    try {
      let value = await arrayOfPromise[i]
      result.push(resolve(value))
    } catch (e) {
      result.push(reject(e))
    }
  }
  return result
}

function TryResolveAllPromiseParallelly (arrayOfPromise, onResolve, onReject) {
  return new Promise((resolve, reject) => {
    let counter = 0
    let result = Array(arrayOfPromise.length)
    arrayOfPromise.forEach((promise, index) => {
      (i) => {
        promise.then((value) => {
          counter++
          result[i] = onResolve(value)
          if (counter === arrayOfPromise.length) resolve(result)
        }, (e) => {
          counter++
          result[i] = onReject(e)
          if (counter === arrayOfPromise.length) resolve(result)
        })
      }(index)
    })
  })
}

async () => {
  try {
    await Promise.all([promise1(1000), promise2, promise3])
  } catch (e) {
    console.log('gg', e)
  }

  let resolve = (value) => {
    console.log('resolve', value)
    return value
  }
  let reject = (value) => {
    console.log('reject', value)
    return new Error(value)
  }

  let promiseArray = [promise1(1000), promise2, promise3]

  let result = await TryResolveAllPromiseSerially(promiseArray, resolve, reject)
  console.log(result)

  let promiseArray2 = [promise1(1000), promise2, promise3]
  let result2 = await TryResolveAllPromiseParallelly(promiseArray2, resolve, reject)
  console.log(result2)
}()
