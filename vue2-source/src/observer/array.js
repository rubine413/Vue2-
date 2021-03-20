const oldArrayProtoMethods = Array.prototype;

export const ArrayMethods = Object.create(oldArrayProtoMethods);

const methods = ['push', 'shift', 'unshift', 'splice', 'pop'];

methods.forEach(method => {
  ArrayMethods[method] = function (...args) {
    // console.log(`数组劫持 ${method} -> ${args}`);
    const result = oldArrayProtoMethods[method].apply(this, args);
    let inserted = null;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
      default:
        break;
    }
    // console.log(`数据劫持 ${method} -> ${inserted}`)
    const ob = this.__ob__;
    if (inserted) {
      ob.observeArray(inserted);
    }
    return result;
  };
});
