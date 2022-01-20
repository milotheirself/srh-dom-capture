const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;

    // +
    section: any = {
      common: {
        label: 'Common HTML Elements',
      },
      custom: {
        label: 'Custom Elements',
      },
    };

    // +
    patternRender: any;
    pattern: any = {
      'common:texts': {
        section: 'common',
        label: 'Text',
        active: true,
      },
      'common:images': {
        section: 'common',
        label: 'Images',
        active: true,
      },
      'common:inputs': {
        section: 'common',
        label: 'Inputs and Forms',
      },
      'custom:elements': {
        section: 'custom',
        label: 'Native CustomElements',
      },
      'custom:elements-lit': {
        section: 'custom',
        label: 'LitElements',
      },
    };

    // +
    constructor() {
      this.host = host;

      const nodes = Object.keys(this.section).map((sec) => {
        const nodes = Object.values(this.pattern)
          .filter((n: any) => n.section == sec)
          .map((node: any) => {
            return {
              label: node.label,
              state: node.active ? 2 : 0,
              nodes: [],
            };
          });

        const state =
          nodes.length == nodes.filter((n: any) => n.state == 2).length
            ? 2 //
            : nodes.filter((n: any) => n.state >= 1).length
            ? 1
            : 0;

        return {
          label: this.section[sec].label,
          state,
          nodes,
        };
      });

      this.patternRender = [
        {
          label: 'All',
          state: 1,
          nodes,
        },
      ];

      console.log(this.patternRender);
    }
  })();
};

export default { ...fragment };
