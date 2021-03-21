/**
 * 创建真实节点替换老节点
 * @param {*} oldVnode
 * @param {*} vnode
 */
export function patch(oldVnode, vnode) {
  console.log('path', oldVnode, vnode);

  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const oldElem = oldVnode;
    const parentElm = oldElem.parentNode;

    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElem.nextSibling);

    parentElm.removeChild(oldElem);

    return el;
  }
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => {
      return vnode.el.append(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties(vnode) {
  const newProps = vnode.data || {};
  console.log(newProps);
  let el = vnode.el;
  for (const key in newProps) {
    if (key === 'style') {
      for (const name in newProps.style) {
        el.style[name] = newProps.style[name];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
