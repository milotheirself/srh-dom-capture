import { default as captureParse } from './module/capture-parse';
import { default as captureRender } from './module/capture-render';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.capture = (target, options: any = {}) => {
  return () => {
    return new Promise(async (resolve, dismiss) => {
      const params = {
        target: target ? target : globalThis.document.body.parentElement,
        result: options.result ? options.result : 2,
        resize: options.resize ? options.resize : 3,
      };

      try {
        // 🖨️ Create a stylized HTMLElement clone
        const captureTarget = params.target;
        const captureHTML = await captureParse.create(captureTarget, params);

        // 📷 Render stylized clone to Blob
        // const captureResult = !globalThis.Worker
        //   ? await captureRender.render(captureHTML, params) //
        //   : await captureRender.worker.render(captureHTML, params);
        const captureResult = await captureRender.render(captureHTML, params);

        // ✨
        resolve({
          blob: captureResult.blob, //
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

// internal.blobToDataURL = (blob) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (evt) => resolve(evt.target.result);
//     reader.readAsDataURL(blob);
//   });
// };

export const { capture } = fragment;
