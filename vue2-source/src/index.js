import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';

function Vue(options) {
  // vue初始化
  this._init(options);
}

initMixin(Vue);

renderMixin(Vue);

lifecycleMixin(Vue);

export default Vue;
