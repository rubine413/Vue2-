export function isObject(data) {
  return typeof data === 'object' && data != null;
}

export function proxy(target, props, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[props][key];
    },
    set(newValue) {
      target[props][key] = newValue;
    },
  });
}
