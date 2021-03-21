import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './initGlobalAPI/index';

function Vue(options) {
  // vue初始化
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

initGlobalAPI(Vue);

export default Vue;
