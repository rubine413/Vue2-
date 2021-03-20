// 把data中的数据都是用Object.defineProperty重新定义 get set
import { isObject } from '../util/index';
import { ArrayMethods } from './array';

export function observe(data) {
  const isObj = isObject(data);
  if (!isObj) {
    return;
  }
  return new Observer(data);
}

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this,
    });
    // 数据层次多需要递归解析
    if (Array.isArray(data)) {
      // 劫持数组对象
      data.__proto__ = ArrayMethods;
      this.observeArray(data);
    } else {
      // 劫持普通对象
      this.walk(data);
    }
  }

  walk(data) {
    let keys = Object.keys(data);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = data[key];
      defineReactive(data, key, value);
    }
  }

  observeArray(data) {
    for (let index = 0; index < data.length; index++) {
      observe(data[index]);
    }
  }
}

function defineReactive(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      // console.log(`访问对象属性 ${key} -> ${value}`);
      return value;
    },
    set(newValue) {
      // console.log(`设置对象属性 ${key} -> ${newValue}`);
      if (newValue === value) {
        return;
      }
      observe(newValue);
      value = newValue;
    },
  });
}
