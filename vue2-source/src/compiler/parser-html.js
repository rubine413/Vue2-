const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 标签开头, 匹配标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 标签闭合
const startTagClose = /^\s*(\/?)>/;
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;

export function parseHTML(html) {
  let index = 0;
  let root; // 根节点
  let currentParent; // 当前父节点
  let stack = [];
  // 循环匹配, 匹配完成后截掉匹配数据
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 先判断, 可能为开始标签/结束标签/文档定义
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
        end(endTagMatch[1]);
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
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
    // break;
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
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
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }
      if (end) {
        // 标签闭合
        advance(end[0].length);
        return match;
      }
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

  function createASTElement(tag, attrs) {
    return {
      tag,
      attrs,
      children: [],
      parent: null,
      type: 1,
    };
  }

  function start(tag, attrs) {
    console.log(`开始标签 -> ${tag}`);
    if (attrs && attrs.length > 0) {
      console.log(`标签属性 -> ${JSON.stringify(attrs)}`);
    }
    const element = createASTElement(tag, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);
  }

  function chars(text) {
    text = text.replace(/\s/g, '');
    if (text) {
      console.log(`获取文本 -> ${text}`);
      currentParent.children.push({
        type: 3,
        text,
      });
    }
  }

  function end(tag) {
    console.log(`结束标签 -> ${tag}`);
    let element = stack.pop();
    // 此处应该判断当前传入的标签与出栈的标签是相同的标签
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  return root;
}
