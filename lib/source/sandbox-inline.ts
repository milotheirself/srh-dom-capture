import * as ModuleCapture from '@milotheirself/module-capture';

(() => {
  console.log('loaded', '@milotheirself/module-capture');
  globalThis.ModuleCapture = ModuleCapture;
})();
