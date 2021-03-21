import { mergeOptions } from '../util/index';

export function initGlobalAPI(Vue) {
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };

  Vue.mixin({
    beforeCreate() {
      console.log('beforeCreate 1');
    },
  });

  Vue.mixin({
    beforeCreate() {
      console.log('beforeCreate 2');
    },
  });
}
