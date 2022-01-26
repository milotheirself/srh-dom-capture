import { capture, context } from '@applicdev/dev-capture';

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
      const targetContext = context({
        target,
        option: {
          capture: { dpr: 1.25, inset: '2.5rem', background: '#eaeaea' },
          resolve: { dpr: 3 },
        },
      });

      // +
      console.log('example:context', targetContext);
      this.captureing[pattern.nonce] = targetContext;
      this.host.requestUpdate();

      // +
      const targetPreview = targetContext.preview();
      console.log('example:preview', targetPreview);

      // // +
      // const targetCapture = targetContext.capture();
      // console.log('example:capture', targetCapture);
      // console.log('example:capture', await targetCapture);

      // // +
      // const file = await targetCapture();
      // this.saveAs(file.blob, `${new Date().toUTCString()}.png`);

      // +
      this.captureing[pattern.nonce] = null;
      this.host.requestUpdate();
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
