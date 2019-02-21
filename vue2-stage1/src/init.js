import { initState } from "./state"

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    console.log('_init')
    // 选项挂载到实例
    this.$options = options
    
    // 初始化配置
    initState(this)
  }
}

