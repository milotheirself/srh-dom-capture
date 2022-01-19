import { default as captureParser } from './parser';
import { default as captureRender } from './render';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

// +
fragment.capture = ({ target, option, render }) => {
  // [...]
};

/**/

// +
fragment.choose = (params) => {
  if ('target' in params) return internal.chooseTarget({ target: params.target });
  if ('option' in params) return internal.chooseOption({ option: params.option });
  if ('render' in params) return internal.chooseRender({ render: params.render });
};

internal.chooseTarget = ({ target }) => {
  console.log(target.cloneNode instanceof Function);

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
