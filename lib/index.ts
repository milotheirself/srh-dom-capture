import { default as Capture } from './module';
import { CaptureParams } from './module/typings';

export function capture(params?: CaptureParams) {
  const { target, option, render } = Capture.choose(params);

  return context({ target, option }).capture({ render });
}

export function context(params?: CaptureParams) {
  const { target, option, render } = Capture.choose(params);

  return {
    // +
    ...{ target, option, render },

    // 🖨️
    preview: {
      capture: { parsed: Capture.parser({ target, option, render }) },
      resolve: { result: null },
    },

    // 🖨️, 📷 and ✨
    capture: (params?: CaptureParams) => {
      const { render } = Capture.choose(params);

      // +
      return Capture.render({
        parsed: Capture.parser({ target, option, render }), //
        option,
      });
    },
  };
}
