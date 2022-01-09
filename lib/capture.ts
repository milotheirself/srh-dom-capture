import { default as parser } from './parser/mod.ts';
import { default as render } from './render/mod.ts';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* option interpretation/normalization */

fragment.choose = ({ params }) => {
  let { target, option, render } = params || {};

  target = internal.chooseTarget({ target });
  option = internal.chooseOption({ option });
  render = internal.chooseRender({ render });

  return { target, option, render };
};

internal.chooseTarget = ({ target }) => {
  switch (true) {
    // +
    case target == undefined:
      target = { node: globalThis.document.body.parentElement, invalid: false };
      break;

    // +
    case target && target.cloneNode instanceof Function:
      target = { node: target, invalid: false };
      break;

    // // +
    // case [...]:
    //   return { node: [...], invalid: false };

    // +
    default:
      target = { node: null, invalid: true };
      break;
  }

  return target;
};

internal.chooseOption = ({ option }) => {
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

internal.chooseRender = ({ render }) => {
  render = render != undefined ? render : {};
  return Array.isArray(render) ? render : [render];
};

export const Capture = { ...parser, ...render, ...fragment };
