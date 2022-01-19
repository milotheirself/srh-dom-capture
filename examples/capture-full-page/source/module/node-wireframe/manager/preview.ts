import { capture, context } from '@applicdev/module-lit-capture';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;

    // +
    constructor() {
      this.host = host;
    }

    // +
    captureing: boolean = false;
    async requestCapture({ type }): Promise<void> {
      if (this.captureing) return;

      this.captureing = true;
      this.host.requestUpdate();

      const targetContext = context({
        target: this.host,
        option: {
          capture: { dpr: 1.25, inset: '2.5rem', background: '#eaeaea' },
          resolve: { dpr: 3 },
        },
      });

      const targetCapture = targetContext.capture();

      console.log(await targetCapture);

      // // +
      // const file = await targetCapture();
      // this.saveAs(file.blob, `${new Date().toUTCString()}.png`);

      // // +
      this.captureing = false;
      this.host.requestUpdate();
    }

    saveAs(blob, filename) {
      const node = document.createElement('a');
      document.body.appendChild(node);

      node.href = URL.createObjectURL(blob);
      node.download = filename;
      node.click();

      URL.revokeObjectURL(node.href);
      document.body.removeChild(node);
    }
  })();
};

export default { ...fragment };
