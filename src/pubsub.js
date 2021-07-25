import { valueOrCreate } from './utils'

export class PubSub {
  constructor() {
    this.handlers = {}
  }

  subscribe(name, callback) {
    const handlers = valueOrCreate(this.handlers, name, () => [])
    const formerIndex = handlers.indexOf(callback)
    if (formerIndex == -1)
      handlers.push(callback)
  }

  unsubscribe(name, callback) {
    const handlers = this.handlers[name]
    if (handlers) {
      const index = handlers.indexOf(callback)
      if (index != -1)
        handlers.splice(index, 1)
    }
  }

  publish(name, data) {
    const handlers = this.handlers[name]
    if (handlers) {
      handlers.forEach(handler => {
        handler(data)
      })
    }
  }
}
