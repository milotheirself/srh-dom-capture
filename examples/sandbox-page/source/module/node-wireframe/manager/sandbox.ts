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
        state: 2,
      },
      custom: {
        label: 'Custom Elements',
        state: 2,
      },
    };

    // +
    patternRender: any;
    pattern: any = {
      'common:texts': {
        section: 'common',
        label: 'Text',
        state: 2,
      },
      'common:images': {
        section: 'common',
        label: 'Images',
        state: 2,
      },
      'common:inputs': {
        section: 'common',
        label: 'Inputs and Forms',
        state: 2,
      },
      'custom:elements': {
        section: 'custom',
        label: 'Native CustomElements',
        state: 2,
      },
      'custom:lit-elements': {
        section: 'custom',
        label: 'LitElements',
        state: 2,
      },
    };

    // +
    constructor() {
      this.host = host;

      this.patternRender = [
        {
          label: 'All',
          active: true,
          state: 2,
          nodes: Object.keys(this.section).map((sec) => {
            const nodes = Object.values(this.pattern).filter((n: any) => n.section == sec);

            return {
              label: this.section[sec].label,
              state: this.section[sec].state,
              nodes: nodes.map((node: any) => {
                return {
                  label: node.label,
                  state: node.state,
                  nodes: [],
                };
              }),
            };
          }),
        },
      ];
    }
  })();
};

export default { ...fragment };
