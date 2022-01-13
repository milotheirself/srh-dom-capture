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
      ],

      // + typescript modules
      module: {
        ...{
          'inline:extension': {
            result: { urn: 'assets/extension.js' },
            source: { urn: 'extension.ts' },
          },
          'inline:extension-content': {
            result: { urn: 'assets/extension-content.js' },
            source: { urn: 'extension-content.ts' },
          },
        },
      },
    });

    resolve(option);
  });
};

export default { ...fragment };
