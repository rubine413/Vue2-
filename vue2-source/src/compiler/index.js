import { generate } from './generate';
import { parseHTML } from './parser-html';

export function compileToFunction(template) {
  // 将模板html解析成ast语法树
  const root = parseHTML(template);
  // 将ast语法树生成render函数, 模板引擎
  // <div id="app"><p>hello {{name}}</p> hello</div>
  // c("div",{id:app},_c("p",undefined,_v('hello’+_s(name))),_v('hello'))
  console.log('生成ast语法树 -> ', root);
  let code = generate(root);
  return new Function(`with(this){ return ${code}}`);
}
