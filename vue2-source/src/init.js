import { compileToFunction } from './compiler/index';
import { callHook, mountComponent } from './lifecycle';
import { initState } from './state';
import { mergeOptions } from './util/index';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    console.log('初始化参数 -> ', options);
    // 数据劫持
    const vm = this;
    // 合并参数
    vm.$options = mergeOptions(vm.constructor.options, options);

    callHook(vm, 'beforeCreate');

    // 初始化状态, data, methods, watch, computed
    initState(vm);

    callHook(vm, 'created');

    // 渲染模板
    if (options.el) {
      vm.$mount(options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;

    el = document.querySelector(el);
    if (!options.render) {
      // 获取模板
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
        console.log('解析模板 -> ', template);
        const render = compileToFunction(template);
        options.render = render;
        console.log('生成render函数 -> ', options.render);
      }
    }

    // 挂载组件
    mountComponent(vm, el);
  };
}
