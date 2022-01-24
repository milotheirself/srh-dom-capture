import { default as litNode } from '@applicdev/dev-content/lib/option/option-module';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.assignOption = (option: {}) => {
  return new Promise((resolve) => {
    Object.assign(option, {
      // + stream paths
      origin: '/example',

      // + source paths
      source: './lib/source',

      // + result paths
      result: './lib/result',
      public: [
        './lib/source-template', //
        './node_modules/@applicdev/dev-content/lib/source-template',
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
