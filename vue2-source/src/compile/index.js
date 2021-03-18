const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;

function createASTElement(tag, attrs) {
  return {
    tag,
    attrs,
    children: [],
    parent: null,
    type: 1,
  };
}

let root;
let currentParent;
let stack = [];

function start(tag, attrs) {
  let element = createASTElement(tag, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element);
}

function chars(text) {
  text = text.replace(/\s/g, '');
  if (text) {
    currentParent.children.push({
      type: 3,
      text,
    });
  }
}

function end(tag) {
  let element = stack.pop();
  currentParent = stack[stack.length - 1];
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}

function parseHTML(html) {
  let index = 0;
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 先判断
      // Doctype:
      const doctypeMatch = html.match(doctype);
      if (doctypeMatch) {
        advance(doctypeMatch[0].length);
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        parseEndTag(endTagMatch[1]);
        continue;
      }
      // 开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        handleStartTag(startTagMatch);
        continue;
      }
    }
    let text;
    if (textEnd > 0) {
      // 文本
      text = html.slice(0, textEnd);
    }
    if (text) {
      console.log(`获取文本 -> ${text}`);
      advance(text.length);
      chars(text);
    }
    // break;
  }

  console.log(stack);

  function parseStartTag() {
    const start = html.match(startTagOpen);
    // console.log('parseStartTag', start);
    console.log(`开始标签 -> ${start[1]}`);
    let match = {
      tagName: start[1],
      attrs: [],
    };
    // 截取开始标签
    advance(start[0].length);
    // 获取属性, 一直到标签闭合
    let attr;
    let end;
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      match.attrs.push({
        name: attr[1],
        value: attr[3],
      });
      console.log(`获取属性 -> ${attr[1]}: ${attr[3]}`);
      advance(attr[0].length);
    }
    if (end) {
      // 标签闭合
      advance(end[0].length);
      return match;
    }
  }

  function advance(n) {
    index += n;
    html = html.substring(n);
    // console.log(`advance -> \`${html}\``);
  }

  function handleStartTag(match) {
    const tagName = match.tagName;
    const attrs = match.attrs;
    start(tagName, attrs);
  }

  function parseEndTag(tagName) {
    console.log(`结束标签 -> ${tagName}`);
    end(tagName);
  }

  return root;
}

export function compileToFunction(template) {
  const r = parseHTML(template);
  console.log('root -> ', r);
}
