// ~
import { default as captureRender } from './module/capture-render';
import { default as captureRenderHTML } from './module/capture-render-html';
// ...

/**
 * @typedef {Object} captureResult
 * @property {number} blob - Image blob object
 * @property {number} blobUrn - Image blob urn
 */

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**
 * @param {Object} optio
 * @param {HTMLElement} optio.target - litRender target
 * @param {number} optio.result - Image result pixel ratio
 * @param {number} optio.resize - Image result pixel scale
 * @returns {captureResult}
 */
fragment.htmlCapture = (optio) => {
  return new Promise(async (resolve, dismiss) => {
    const config = {
      result: optio.result || globalThis.devicePixelRatio,
      resize: optio.resize || 1,
    };

    try {
      // 🖨️ Create a stylized HTMLElement clone
      const captureTarget = optio.target || globalThis.document.body.parentNode;
      const captureHTML = await captureRenderHTML.create(captureTarget, config);

      // 📷 Render stylized clone to Blob
      const captureResult = !globalThis.Worker
        ? await captureRender.render(captureHTML, config) //
        : await captureRender.worker.render(captureHTML, config);

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

internal.blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (evt) => resolve(evt.target.result);
    reader.readAsDataURL(blob);
  });
};

export default fragment;
