// 把data中的数据都是用Object.defineProperty重新定义 get set
import { isObject } from '../util/index';
import { ArrayMethods } from './array';

class Observer {
  constructor(value) {
    // 数据层次多需要递归解析
    if (Array.isArray(value)) {
      // 劫持数组对象
      value.__proto__ = ArrayMethods;
      this.observeArray(value);
    } else {
      // 劫持普通对象
      this.walk(value);
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
      const value = data[index];
    }
  }
}

function defineReactive(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      console.log(`访问对象属性 ${key} -> 值 ${value}`);
      return value;
    },
    set(newValue) {
      console.log(`设置对象属性 ${key} -> 值 ${newValue}`);
      if (newValue === value) {
        return;
      }
      observe(newValue);
      value = newValue;
    },
  });
}

export function observe(data) {
  const isObj = isObject(data);
  if (!isObj) {
    return;
  }
  return new Observer(data);
}
