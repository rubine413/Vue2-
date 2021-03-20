class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    // 将内部传过来的回调函数放到getter属性上
    this.getter = exprOrFn;

    this.get();
  }
  get() {
    this.getter();
  }
}

export default Watcher;
