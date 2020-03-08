import { initState } from './state';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    console.log(options);
    // 数据劫持
    const vm = this;
    vm.$options = options;

    initState(vm);
  };
}
