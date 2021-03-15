import { initState } from './state';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    console.log(options);
    // 数据劫持
    const vm = this;
    vm.$options = options;

    // 初始化状态, data, methods, watch, computed
    initState(vm);

    // 渲染模板
    if (options.el) {
      vm.$mount(options.el);
    }
  };

  Vue.prototype.$mount = function (selector) {
    console.log('$mount -> ', selector);
    const vm = this;
    const options = vm.$options;
    const el = document.querySelector(selector);
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
        console.log('$mount -> ', template);
      }
    }
    vm.$el = el;
  };
}
