import { observe } from './observer/index';

export function initState(vm) {
  const options = vm.$options;
  console.log('init state', options);
  // 初始化 属性/方法/数据/计算属性/监听
  if (options.props) {
    initProps(vm);
  }

  if (options.data) {
    initData(vm);
  }
}

function initProps(vm) {}
function initMethods(vm) {}
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data == 'function' ? data.call(vm) : data;
  console.log('initData', data);
  // 数据劫持, 响应式原理
  observe(data);
}
function initComputed(vm) {}
function initWatch(vm) {}
