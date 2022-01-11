import { default as litNode } from '@applicdev/module-lit-node/source/option/option-module';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.assignOption = (option: {}) => {
  return new Promise((resolve) => {
    Object.assign(option, {
      // + stream paths
      origin: '/example',

      // + source paths
      source: './source',

      // + result paths
      result: './result',
      public: [
        './source-template', //
        './node_modules/@applicdev/module-lit-node/source-template',
      ],

      // + typescript modules
      module: {
        ...litNode,
        ...{
          'inline:example': {
            result: { urn: 'assets/example.js' },
            source: { urn: 'example.ts' },
          },
        },
      },
    });

    resolve(option);
  });
};

export default { ...fragment };
