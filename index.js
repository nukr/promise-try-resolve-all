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

function TryResolveAllPromiseParallelly (arrayOfPromise, resolve, reject, done) {
  let counter = 0
  let result = Array(arrayOfPromise.length)
  arrayOfPromise.forEach((promise, index) => {
    (i) => {
      promise.then((value) => {
        counter++
        result[i] = resolve(value)
        if (counter === arrayOfPromise.length) done(result)
      }, (e) => {
        counter++
        result[i] = reject(e)
        if (counter === arrayOfPromise.length) done(result)
      })
    }(index)
  })
}

async () => {
  // let result = await Promise.all([promise1, promise2, promise3])
  // console.log(result)
  let resolve = (value) => {
    console.log('resolve', value)
    return value
  }
  let reject = (value) => {
    console.log('reject', value)
    return new Error(value)
  }

  let done = (result) => {
    console.log('@@@@ result = ', result)
  }

  let result = await TryResolveAllPromiseSerially([promise1(1000), promise2, promise3], resolve, reject)
  console.log(result)

  TryResolveAllPromiseParallelly([promise1(1000), promise2, promise3], resolve, reject, done)
}()
