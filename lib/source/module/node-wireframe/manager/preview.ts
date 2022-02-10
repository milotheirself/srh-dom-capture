import { capture, context } from '@applicdev/applic-dev-capture';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;
    captureing: any;

    // +
    constructor() {
      this.host = host;
      this.captureing = {};
    }

    // +
    async requestCapture({ pattern }): Promise<void> {
      const node = this.host.shadowRoot.querySelector(`[node-capture-target="${pattern.nonce}"]`);
      if (!node) return console.log(`capture-target "${pattern.nonce}"] not found`);

      // +
      if (pattern.nonce in this.captureing) return;

      // +
      const target = node;
      // const target = globalThis.document.body;
      const targetContext = context({
        target,
        option: {
          capture: { dpr: 2 },
          resolve: { dpr: 1 },
        },
      });

      // +
      // console.log('example:context', targetContext);
      this.captureing[pattern.nonce] = targetContext;
      this.host.requestUpdate();

      // // +
      // const targetPreview = targetContext.preview();
      // console.log('example:preview', targetPreview);

      // +
      const targetCapture = targetContext.capture();
      console.log('example:capture', targetCapture);

      // +
      delete this.captureing[pattern.nonce];
      this.host.requestUpdate();

      const resultRaster = await targetCapture.raster;
      const can = new globalThis.OffscreenCanvas(resultRaster.wid, resultRaster.hei);
      const ctx = can.getContext('2d');

      const data = new ImageData(resultRaster.result, resultRaster.wid, resultRaster.hei);
      ctx.putImageData(data, 0, 0);

      // +
      this.host.sandbox.onCapture({
        pattern: pattern.nonce,
        bounds: (await targetCapture).parsed.bounds,
        result: {
          urn: URL.createObjectURL(await can.convertToBlob()),
        },
      });
    }

    // saveAs(blob, filename) {
    //   const node = document.createElement('a');
    //   document.body.appendChild(node);

    //   node.href = URL.createObjectURL(blob);
    //   node.download = filename;
    //   node.click();

    //   URL.revokeObjectURL(node.href);
    //   document.body.removeChild(node);
    // }
  })();
};

export default { ...fragment };
