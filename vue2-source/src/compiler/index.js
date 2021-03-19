import { parseHTML } from './parser-html';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 处理属性
function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name === 'style') {
      // style="color: #fe0000; font-size: 14px" -> { style: { color: '#fe0000', font-size: '14px' }}
      const obj = {};
      attr.value.split(';').forEach(item => {
        const [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function gen(node) {
  if (node.type == 1) {
    return generate(node);
  } else {
    let text = node.text;
    let match, index;
    let tokens = [];
    let lastIndex = (defaultTagRE.lastIndex = 0);
    // let
    while ((match = defaultTagRE.exec(text))) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    // Name：{{ name }}, Age：{{ age }}
    // _v("Name：" + _s(name) + "Age：" + _s(age))
    return `_v(${tokens.join('+')})`;
  }
}

function genChildren(el) {
  const children = el.children;
  if (children && children.length) {
    return `${children.map(child => gen(child)).join(',')}`;
  }
  return null;
}

function generate(el) {
  let children = genChildren(el);
  let code = `_c("${el.tag}", ${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `, ${children}` : ''})`;
  return code;
}

export function compileToFunction(template) {
  // 将模板html解析成ast语法树
  const root = parseHTML(template);
  // 将ast语法树生成render函数, 模板引擎
  // <div id="app"><p>hello {{name}}</p> hello</div>
  // c("div",{id:app},_c("p",undefined,_v('hello’+_s(name))),_v('hello'))
  console.log('root -> ', root);
  let code = generate(root);
  console.log('code -> ', code);
  return new Function(`with(this){ return ${code}}`);
}
