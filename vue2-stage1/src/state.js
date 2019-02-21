import { observe } from './observe/index'

export function initState(vm) {
  const options = vm.$options
  if (options.data) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      console.log(`vm代理取值${key}`)
      return vm[target][key]
    }
  })
}

export function initData(vm) {
  let { data } = vm.$options

  data = typeof data === 'function' ? data.call(vm) : data

  vm._data = data
  observe(data) 

  for (const key in data) {
    proxy(vm, '_data', key)
  }
}
