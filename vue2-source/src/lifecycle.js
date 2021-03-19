export function lifecycleMixin(Vue) {
  Vue.prototype._update = function () {};
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el;

  let updateComponent = () => {
    // 返回的是虚拟dom
    const dom = vm._render();
    // 创建真实dom
    vm._update(dom);
  };
  // 渲染watcher
}
