import { capture } from '@applicdev/module-lit-capture';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;
    captureing: boolean = false;

    // +
    constructor() {
      this.host = host;
    }

    requestCapture(): void {
      internal.state.captureing = true;
      internal.requestUpdate();

      // +
      internal.requestAnimationFrame(async () => {
        const target = this;
        const targetCapture = capture({
          target,
          option: {
            result: { dpr: 1 },
            resize: { dpr: 1 },
          },
        });

        console.log(targetCapture);

        // // +
        // const file = await targetCapture();
        // this.saveAs(file.blob, `${new Date().toUTCString()}.png`);

        // // +
        this.captureing = false;
        this.host.requestUpdate();
      });
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
