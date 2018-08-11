export default class EventDispatcher {
  handlers = {}

  addEventListener(key, func) {
    if (!this.handlers[key])
      this.handlers[key] = [func]
    else
      this.handlers[key].push(func)

  }

  dispatch(key) {
    const handlers = this.handlers[key]
    if (!handlers) return

    handlers.foreach(func => func())
  }
}