import { default as captureRender } from './module/capture-render';
import { default as captureRenderHTML } from './module/capture-render-html';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.capture = (target, options) => {
  return () => {
    return new Promise(async (resolve, dismiss) => {
      const params = {
        target,
        result: options.result || globalThis.devicePixelRatio,
        resize: options.resize || 1,
      };

      console.log(target, options);

      try {
        // 🖨️ Create a stylized HTMLElement clone
        const captureTarget = target || globalThis.document.body.parentNode;
        const captureHTML = await captureRenderHTML.create(captureTarget, params);

        // 📷 Render stylized clone to Blob
        // const captureResult = !globalThis.Worker
        //   ? await captureRender.render(captureHTML, params) //
        //   : await captureRender.worker.render(captureHTML, params);
        const captureResult = await captureRender.render(captureHTML, params);

        // ✨
        resolve({
          blob: captureResult.blob, //
          blobUrn: await internal.blobToDataURL(captureResult.blob),
          // blobUrn: captureResult.blobUrn,
        });
      } catch (err) {
        // 😕
        dismiss();
        console.error(err);
      }
    });
  };
};

internal.blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (evt) => resolve(evt.target.result);
    reader.readAsDataURL(blob);
  });
};

export const { capture } = fragment;
