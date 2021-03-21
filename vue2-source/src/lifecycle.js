import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el;

  callHook(vm, 'beforeMount');

  let updateComponent = () => {
    // 返回的是虚拟dom
    const dom = vm._render();
    console.log('生成虚拟dom -> ', dom);
    // 创建真实dom
    vm._update(dom);
  };
  // 渲染watcher

  new Watcher(vm, updateComponent, () => {}, true);

  callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let index = 0; index < handlers.length; index++) {
      handlers[index].call(vm);
    }
  }
}
