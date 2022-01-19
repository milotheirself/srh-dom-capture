import { default as litCapture } from './module/capture';

interface CaptureParams {
  /**
   * [...]
   */
  target?: any;

  /**
   * [...]
   */
  option?: CaptureOption;

  /**
   * [...]
   */
  render?: { [prop: string]: any } | { [prop: string]: any }[];
}

interface CaptureOption {
  capture?: { dpr?: number; inset?: string; background?: string };
  resolve?: { dpr?: number };
}

export function capture(params?: CaptureParams) {
  return context(params).capture(params);
}

export function context(params?: CaptureParams) {
  const { target, option } = litCapture.choose(params);

  // +
  return {
    // 🖨️
    preview: {
      capture: { parsed: litCapture.parser({ target, option, render: null }) },
      resolve: { result: null },
    },

    // 🖨️, 📷 and ✨
    capture: (params?: CaptureParams) => {
      const { render } = litCapture.choose(params);

      // +
      return litCapture.render({
        parsed: litCapture.parser({ target, option, render }), //
        option,
      });
    },
  };
}
