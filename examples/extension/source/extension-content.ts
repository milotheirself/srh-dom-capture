import { capture } from '@applicdev/module-lit-capture';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

internal.capture = async (target) => {
  console.log('capture ', target);

  const targetCapture = capture(target, {
    result: 1.5,
    resize: 1,
  });

  // +
  const file = await targetCapture();
  console.log('done ', file.blob);
  internal.saveAs(file.blob, `${new Date().toUTCString()}.png`);
};

internal.saveAs = (blob, filename) => {
  const node = document.createElement('a');
  document.body.appendChild(node);

  node.href = URL.createObjectURL(blob);
  node.download = filename;
  node.click();

  URL.revokeObjectURL(node.href);
  document.body.removeChild(node);
};

/**/

// @ts-ignore
const chrome = globalThis.chrome;
chrome.runtime.onMessage //
  .addListener((request, sender, sendResponse) => {
    internal.capture(document.body.parentElement);
    sendResponse({ result: 'success' });
  });
