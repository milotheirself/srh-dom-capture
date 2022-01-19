import { default as captureParser } from './parser';
import { default as captureRender } from './render';
import { default as captureOption } from './option';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

// +
fragment.render = ({ parsed, option }) => {
  console.log('render', { parsed, option });
  return new Promise(() => {
    // [...]
  });
};

// +
fragment.parser = ({ target, option, render }): Promise<void> => {
  console.log('parser', { target, option, render });
  return new Promise(() => {
    // [...]
  });
};

// +
fragment.choose = (params?: any) => {
  const { target, option, render } = params || {};

  return {
    target: captureOption.chooseTarget({ target }),
    option: captureOption.chooseOption({ option }),
    render: captureOption.chooseRender({ render }),
  };
};

export default { ...fragment };
