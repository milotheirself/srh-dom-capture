const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

// +
fragment.chooseTarget = ({ target }) => {
  switch (true) {
    // +
    case target == undefined:
      return { node: globalThis.document.body.parentElement, invalid: false };

    // +
    case target && target.cloneNode instanceof Function:
      return { node: target, invalid: false };

    // // +
    // case [...]:
    //   return { node: [...], invalid: false };

    // +
    default:
      return { node: null, invalid: true };
  }
};

// +
fragment.chooseOption = ({ option }) => {
  return {
    capture: {
      dpr: globalThis.devicePixelRatio || 1,
      ...(option && option.capture ? option.capture : {}),
    },
    resolve: {
      dpr: 1,
      ...(option && option.resolve ? option.resolve : {}),
    },
  };
};

// +
fragment.chooseRender = ({ render }) => {
  return Array.isArray(render) ? render : [render];
};

export default { ...fragment };
