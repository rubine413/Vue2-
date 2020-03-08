const oldArrayProtoMethods = Array.prototype;

export const ArrayMethods = Object.create(oldArrayProtoMethods);

const methods = ['push', 'shift', 'unshift', 'splice', 'pop'];

methods.forEach(method => {
  ArrayMethods[method] = function (...args) {
    console.log(`数组劫持 ${method} -> ${args}`);
    const result = oldArrayProtoMethods[method].apply(this, args);

    return result;
  };
});
