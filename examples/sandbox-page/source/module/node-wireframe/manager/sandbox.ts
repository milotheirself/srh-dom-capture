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
      'sandbox-debug:common-texts': {
        section: 'common',
        label: 'Text',
        active: true,
      },
      'sandbox-debug:common-images': {
        section: 'common',
        label: 'Images',
        active: true,
      },
      'sandbox-debug:common-inputs': {
        section: 'common',
        label: 'Inputs and Forms',
      },
      'sandbox-debug:custom-elements': {
        section: 'custom',
        label: 'Native CustomElements',
      },
      'sandbox-debug:custom-elements-lit': {
        section: 'custom',
        label: 'LitElements',
      },
    };

    // +
    constructor() {
      this.host = host;
      this.requestUpdate();
    }

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

      this.host.requestUpdate();
    }

    onAction(event) {
      if (event.type == 'keydown' && !(event.code == 'Space' || event.code == 'Enter')) return;
      event?.preventDefault();

      console.log(event);

      const nonce =
        event.path[0].getAttribute('node-nonce') || //
        event.path[1].getAttribute('node-nonce');

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
