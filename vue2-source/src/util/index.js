const LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed'];

function mergeHook(source, target) {
  if (target) {
    if (source) {
      return source.concat(target);
    } else {
      return [target];
    }
  } else {
    return source;
  }
}

const STRATEGIES = {};
LIFECYCLE_HOOKS.forEach(hook => {
  STRATEGIES[hook] = mergeHook;
});

export function isObject(data) {
  return typeof data === 'object' && data != null;
}

export function proxy(target, props, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[props][key];
    },
    set(newValue) {
      target[props][key] = newValue;
    },
  });
}

export function mergeOptions(source, target) {
  const options = {};
  for (const key in source) {
    mergeField(key);
  }
  for (const key in target) {
    if (!options.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (STRATEGIES[key]) {
      return (options[key] = STRATEGIES[key](source[key], target[key]));
    }
    if (typeof source[key] == 'object' && typeof target[key] == 'object') {
      options[key] = {
        ...source[key],
        ...target[key],
      };
    } else if (target[key] == null) {
      options[key] = source[key];
    } else {
      options[key] = target[key];
    }
  }
  return options;
}
