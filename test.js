// this one is on the top level
// SyntaxError: await is only valid in async functions and the top level bodies of modules
// await Promise.resolve()


// here is top level

(async () => {
  // here is not top level, inside function
  // this one is not
  await Promise.resolve() // no error
})()

// here is top level
