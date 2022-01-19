import { default as litCapture } from './module/capture';

const fragment: { [prop: string]: any } = {};
// const internal: { [prop: string]: any } = {};

/**/
fragment.capture = ({ target, option, render }) => {
  return fragment.context({ target, option }).capture({ render });
};

fragment.context = ({ target, option }) => {
  target = litCapture.choose({ target });
  option = litCapture.choose({ option });

  return {
    // 🖨️
    preview: {
      capture: { result: { data: [0, 0, 0, 0], height: 0, width: 0 } },
      resolve: { result: { data: [0, 0, 0, 0], height: 0, width: 0 } },
    },

    // 🖨️, 📷 and ✨
    capture: ({ render }) => {
      render = litCapture.choose({ render });

      console.log({ target, option, render });
    },
  };
};

export const { capture, context } = fragment;
export default { ...fragment };
