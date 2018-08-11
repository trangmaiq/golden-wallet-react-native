export default class Stack {
  constructor() {
    this.elements = []
    this.length = 0
  }

  size() {
    return this.length
  }

  push(element) {
    this.length += 1
    this.elements.push(element)
  }

  pop() {
    if (this.length > 0) {
      this.length -= 1
      return this.elements.pop()
    }
    return null
  }

  top() {
    return this.elements[this.length]
  }
}
