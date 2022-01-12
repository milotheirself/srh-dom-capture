import { Capture } from './module';
import { CaptureInterface } from './module/types';

export function context(params?: CaptureInterface.Params): CaptureInterface.Struct {
  const { target, option } = Capture.choose({ params });

  return {
    // 🖨️ parse only
    preview: (params?: CaptureInterface.Params): CaptureInterface.Result => {
      const { render } = Capture.choose({ params });
      const { parsed } = Capture.parser({ target, option, render });

      return { parsed, raster: null, vector: null };
    },

    // 🖨️ parse, 📷 rasterize and ✨ resolve
    capture: (params?: CaptureInterface.Params): CaptureInterface.Result => {
      const { render } = Capture.choose({ params });
      const { parsed } = Capture.parser({ target, render, option });
      const { raster, vector } = Capture.render({ parsed, option });

      return { parsed, raster, vector };
    },
  };
}

export function capture(params?: CaptureInterface.Params): CaptureInterface.Result {
  const { target, option, render } = Capture.choose({ params });

  return context({ target, option }).capture({ render });
}
