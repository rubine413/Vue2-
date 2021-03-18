const oldArrayProto = Array.prototype

export let newArrayProto = Object.create(oldArrayProto)


const methods = [
  'push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'
]


methods.forEach(method => {
  newArrayProto[method] = function (...args) {
    let result = oldArrayProto[method].call(this, ...args)

    console.log('aspect method', method)
    let newItems
    switch (method) {
      case 'push':
      case 'unshift':
        newItems = args
        break;
      case 'splice':
        newItems = args.slice(2)
      default:
        break;
    }
    if (newItems) {
      this.__ob__.observeArray(newItems)
    }
    return result
  }
})
