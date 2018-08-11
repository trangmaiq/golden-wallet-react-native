export const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve))
export const stacksRequest = (stacks, fn) => {
  let queue = Promise.resolve()

  const values = []
  stacks.forEach((item) => {
    queue = queue.then(() => nextFrame().then(() => values.push(fn(item))))
  })
  return queue.then(() => values)
}

export default nextFrame
