import { default as captureParser } from './parser';
import { default as captureRender } from './render';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

// +
fragment.render = ({ parsed, option }) => {
  // [...]
};

/**/

// +
fragment.parser = ({ target, option, render }) => {
  // [...]
};

/**/

// +
fragment.choose = (params?: any) => {
  const { target, option, render } = params || {};

  return {
    target: internal.chooseTarget({ target }),
    option: internal.chooseOption({ option }),
    render: internal.chooseRender({ render }),
  };
};

// +
internal.chooseTarget = ({ target }) => {
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
internal.chooseOption = ({ option }) => {
  return {
    capture: {
      dpr: globalThis.devicePixelRatio || 1,
      ...(option.capture || {}),
    },
    resolve: {
      dpr: 1,
      ...(option.resolve || {}),
    },
  };
};

// +
internal.chooseRender = ({ render }) => {
  return render;
};

export default { ...fragment };
