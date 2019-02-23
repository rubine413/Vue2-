let id = 0
class Observe {
  constructor(data) {
    this.id = ++id
    Object.defineProperty(data, '_ob_', {
      value: this,
      enumerable: false,
    })
    if (Array.isArray(data)) {
      // 监测数组
      data.forEach(item => observe(item))
    } else {
      // 监测对象
      this.walk(data)
    }
  }

  // 循环对象，对属性进行劫持
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
}

export function defineReactive(target, key, value) {
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      // 取值执行get
      console.log(`取值${key}: ${JSON.stringify(value)}`)
      return value
    },
    set(newVal) {
      // 设值
      console.log(`设值${key}: ${JSON.stringify(newVal)}`)
      if (newVal === value) {
        return
      }
      value = newVal
    },
  })
}

export function observe(data) {
  // 劫持对象
  if (!data || typeof data !== 'object') {
    return
  }

  return new Observe(data)
}
