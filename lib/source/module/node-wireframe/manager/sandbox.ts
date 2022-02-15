import './sandbox-patterns';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;

    // +
    section: any = {
      common: {
        label: 'Common Elements',
      },
      custom: {
        label: 'Shadow DOM & CustomElements',
      },
    };

    // +
    patternRender: any;
    pattern: any = {
      'sandbox-debug:common-texts': {
        section: 'common',
        label: 'Text and Boxes',
      },
      'sandbox-debug:common-overflow': {
        section: 'common',
        label: 'Overflow',
      },
      'sandbox-debug:common-tables': {
        section: 'common',
        label: 'Tables',
      },
      'sandbox-debug:common-images': {
        section: 'common',
        label: 'Images',
      },

      'sandbox-debug:common-inputs': {
        section: 'custom',
        label: 'Inputs',
      },
      'sandbox-debug:custom': {
        section: 'custom',
        label: 'Native CustomElements',
      },
      // 'sandbox-debug:custom-lit-elements': {
      //   section: 'custom',
      //   label: 'LitElements',
      // },
      // 'sandbox-debug:custom-lit-expressions': {
      //   section: 'custom',
      //   label: "Lit's html and css expressions",
      // },
    };

    // +
    constructor() {
      this.host = host;
      this.requestSync();
      this.requestUpdate();
    }

    /**/

    requestPush() {
      const state = { pattern: {} };
      for (const key in this.pattern) {
        state.pattern[key] = this.pattern[key].active;
      }

      globalThis.localStorage.setItem('example:sandbox', JSON.stringify(state));
    }

    requestSync() {
      const state = JSON.parse(globalThis.localStorage.getItem('example:sandbox'));
      if (!state || !('pattern' in state)) return;

      for (const key in this.pattern) {
        if (key in state.pattern) this.pattern[key].active = state.pattern[key];
      }
    }

    /**/

    // ---
    // FIXME: This needs all to be rewitten~
    requestUpdate() {
      const nodes = Object.keys(this.section).map((sec) => {
        const nodes = Object.keys(this.pattern)
          .filter((key: any) => this.pattern[key].section == sec)
          .map((key: any) => {
            return {
              nonce: key,
              label: this.pattern[key].label,
              state: this.pattern[key].active ? 2 : 0,
              nodes: [],
              value: this.pattern[key].value || {},
            };
          });

        let state = 0;
        state += nodes.length == nodes.filter((n: any) => n.state == 2).length ? 1 : 0;
        state += nodes.filter((n: any) => n.state >= 1).length ? 1 : 0;

        return {
          nonce: sec,
          label: this.section[sec].label,
          state,
          nodes,
        };
      });

      let state = 0;
      state += nodes.length == nodes.filter((n: any) => n.state == 2).length ? 1 : 0;
      state += nodes.filter((n: any) => n.state >= 1).length ? 1 : 0;

      this.patternRender = [
        {
          nonce: '*',
          label: 'All',
          state: state,
          nodes,
        },
      ];

      this.requestPush();
      this.host.requestUpdate();
    }

    onCapture({ pattern, result, bounds }) {
      this.pattern[pattern].value = { result, bounds };
      this.requestUpdate();
    }

    onAction(event) {
      if (event.type == 'keydown' && !(event.code == 'Space' || event.code == 'Enter')) return;
      event?.preventDefault();

      const nonce =
        event.target.getAttribute('node-nonce') || //
        event.target.parentNode.getAttribute('node-nonce');

      switch (true) {
        case nonce == '*': {
          let state = true;
          Object.keys(this.pattern) //
            .forEach((key) => {
              if (!this.pattern[key].active) state = false;
            });
          Object.keys(this.pattern) //
            .forEach((key) => {
              this.pattern[key].active = !state;
            });

          break;
        }

        case nonce in this.section: {
          let state = true;
          Object.keys(this.pattern) //
            .forEach((key) => {
              let pat = this.pattern[key];
              if (pat.section == nonce && !pat.active) state = false;
            });
          Object.keys(this.pattern) //
            .forEach((key) => {
              let pat = this.pattern[key];
              if (pat.section == nonce) pat.active = !state;
            });
          break;
        }

        case nonce in this.pattern: {
          this.pattern[nonce].active = !this.pattern[nonce].active;
          break;
        }
      }

      this.requestUpdate();
    }
    // ---
  })();
};

export default { ...fragment };
