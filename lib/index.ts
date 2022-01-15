import { default as captureParse } from './module/old/capture-parse';
import { default as captureRender } from './module/capture-render';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

fragment.capture = ({ target, option, render }) => {
  return fragment.context({ target, option }).capture({ render });
};

fragment.context = ({ target, option }) => {
  target = target || globalThis.document.body.parentElement;
  option = {
    capture: { dpr: globalThis.devicePixelRatio || 1, ...(option.capture || {}) },
    resolve: { dpr: 1, types: { url: true }, ...(option.resolve || {}) },
  };

  return {
    // 🖨️
    preview: {
      capture: { ...option.capture },
      resolve: { ...option.resolve, blob: null, url: null },
    },

    // 🖨️, 📷 and 🖼️✨
    capture: ({ render }) => {
      return internal.capture({ target, option, render: render });
    },
  };
};

/**/

internal.capture = ({ target, option }) => {
  return new Promise(async (resolve, dismiss) => {
    try {
      // 🖨️ create a stylized HTMLElement duplicate
      const targetDuplicate = await captureParse.create(target, option);

      // 📷 render stylized duplicate to canvas
      const result = await captureRender.render(
        targetDuplicate, //
        option
      );

      // 🖼️✨ resolve
      resolve({ ...result });
    } catch (err) {
      // 😕
      console.log(err);
      dismiss({});
    }
  });
};

export const { capture, context } = fragment;
