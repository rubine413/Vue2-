import { initMixin } from './init';
import { renderMixin } from './render';

function Vue(options) {
  // vue初始化
  this._init(options);
}

initMixin(Vue);

renderMixin(Vue);

export default Vue;
