import { default as litNode } from '@applicdev/applic-dev-content/lib/option/option-module';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.assignOption = (option: {}) => {
  return new Promise((resolve) => {
    Object.assign(option, {
      // + stream paths
      origin: '/module-capture',

      // + source paths
      source: './lib/source',

      // + result paths
      result: './lib/result',
      public: [
        './lib/source-template', //
        './node_modules/@applicdev/applic-dev-content/lib/source-template',
      ],

      // + typescript modules
      module: {
        ...litNode,
        ...{
          'inline:sandbox': {
            result: { urn: 'assets/module-capture.js' },
            source: { urn: 'sandbox.ts' },
          },
          'inline:sandbox-inline': {
            result: { urn: '0.0.1/module-capture.js' },
            source: { urn: 'sandbox-inline.ts' },
          },
        },
      },
    });

    resolve(option);
  });
};

export default { ...fragment };
