import { pattern, css, html, customElement, LitElement } from '@applicdev/module-lit';
import { capture } from '@applicdev/module-lit-capture';

/**/

pattern.reference('example-wireframe:sandbox').create(
  () => css`
    .host-node.sandbox {
      display: flex;
      flex-direction: column;
      flex: none;

      width: calc(50% - var(--node-margin) * 2);
      padding: var(--node-gutter) var(--node-margin);

      border-radius: var(--tone-border-corner);
      background: var(--tone-backdrop-drk);

      overflow: hidden;
    }
  `,
  () => html`
    <div class="host-node sandbox">
      <!---->
      <span class="node-typo tag-sm">Sandbox</span>
      <!---->
    </div>
  `
);

/**/

@customElement('example-wireframe')
export class ExampleWireframe extends LitElement {
  static styles = [
    // +
    pattern.reference('node-common').styles(),
    pattern.reference('example-wireframe:sandbox').styles(),

    // +
    css`
      :host {
        position: relative;

        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: row;
        flex: none;

        background: var(--tone-backdrop);
      }

      .host-node.wireframe {
        display: flex;
        flex-direction: row;
        flex: auto;

        padding: var(--node-margin);
      }

      .host-node.actions {
        margin: var(--node-gutter) var(--node-margin);
      }
      .host-node.actions > * {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: none;

        height: 2rem;
        margin: 0rem 0rem;
        padding: 0rem var(--node-gutter);

        cursor: pointer;
      }
      .host-node.actions > *[aria-disabled] {
        opacity: 0.4;
        pointer-events: none;
        cursor: unset;
      }
    `,
  ];

  render() {
    return [
      // +
      html`
        <!---->
        <div class="host-node wireframe">
          <!---->
          ${pattern.reference('example-wireframe:sandbox').render()}
          <!---->
          <!---->
          <div class="host-node actions">
            <button ?aria-disabled="${this.captureing}" @click="${this.requestCapture.bind(this)}">
              <!---->
              <span class="node-typo tag-sm">${this.captureing ? 'Processing...' : 'Capture'}</span>
              <!---->
            </button>
          </div>
          <!---->
        </div>
        <!---->
      `,
    ];
  }

  // +
  firstUpdated(): void {}
  updated(): void {}

  // +
  captureing: boolean = false;
  requestCapture(): void {
    this.captureing = true;
    this.requestUpdate();

    // +
    requestAnimationFrame(async () => {
      const target = this.shadowRoot.querySelector('.host-node.sandbox');
      const targetCapture = capture(target, {
        result: 1,
        resize: 3,
      });

      // +
      const result = await targetCapture();
      console.log('result', result);
      this.saveAs(result.blob, `${new Date().toUTCString()}.png`);

      // +
      this.captureing = false;
      this.requestUpdate();
    });
  }

  saveAs(blob, filename) {
    const node = document.createElement('a');
    document.body.appendChild(node);

    node.href = window.URL.createObjectURL(blob);
    node.download = filename;
    node.click();

    window.URL.revokeObjectURL(node.href);
    document.body.removeChild(node);
  }
}
