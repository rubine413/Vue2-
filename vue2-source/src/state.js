import { observe } from './observer/index';
import { proxy } from './util/index';

export function initState(vm) {
  const options = vm.$options;
  // 初始化 属性/方法/数据/计算属性/监听
  if (options.props) {
    initProps(vm);
  }
  if (options.methods) {
    initMethods(vm);
  }

  if (options.data) {
    initData(vm);
  } else {
    // 数据初始化为空对象
  }
  if (options.computed) {
    initComputed(vm);
  }
  if (options.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {}
function initMethods(vm) {}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data == 'function' ? data.call(vm) : data || {};
  // 将data上的属性代理到vm实例上
  for (const key in data) {
    proxy(vm, '_data', key)
  }
  // 数据劫持, 响应式原理
  observe(data);
}

function initComputed(vm) {}
function initWatch(vm) {}
