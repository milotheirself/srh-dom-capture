import { pattern, css, html, customElement, LitElement } from '@applicdev/module-lit';
import { capture } from '@applicdev/module-lit-capture';

/**/

pattern.reference('example-wireframe:sandbox').create(
  () => css`
    .host-node.sandbox {
      position: relative;

      display: flex;
      flex-direction: column;
      flex: auto;

      border-radius: var(--tone-border-corner);
      background: var(--tone-backdrop-drk);

      overflow: hidden;
    }
    .host-node.sandbox > .sandbox-inner {
      position: absolute;
      inset: 0rem 0rem;

      display: flex;
      flex-direction: column;
      flex: none;

      padding: var(--node-gutter) var(--node-margin);
      background: var(--tone-backdrop-drk);
    }
    .host-node.sandbox > .sandbox-inner > [contenteditable] {
      flex: auto;
      width: 100%;
      resize: none;

      font-size: 1rem;
      color: var(--tone-type);
      outline: none;
    }
  `,
  () => html`
    <div class="host-node sandbox">
      <div class="sandbox-inner">
        <!---->
        <span class="node-typo tag-sm">Sandbox</span>
        <div contenteditable="true">${'Hello, World! 👋 '}</div>
        <!---->
      </div>
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
        flex-direction: column;
        flex: auto;

        padding: var(--node-margin);
      }

      .host-node.actions {
        display: flex;
        flex-direction: row;
        flex: none;

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
          <div>
            <div class="host-node actions">
              ${this.captureing
                ? html`<span class="node-typo tag-sm">Processing...</span>`
                : html`
                    <button @click="${this.requestCapture.bind(this, { result: 1, resize: 5 })}">
                      <!---->
                      <span class="node-typo tag-sm">1 DPI</span>
                      <!---->
                    </button>
                    <button @click="${this.requestCapture.bind(this, { result: 2, resize: 5 })}">
                      <!---->
                      <span class="node-typo tag-sm">2 DPI</span>
                      <!---->
                    </button>
                    <button @click="${this.requestCapture.bind(this, { result: 3, resize: 5 })}">
                      <!---->
                      <span class="node-typo tag-sm">3 DPI</span>
                      <!---->
                    </button>
                  `}
            </div>
          </div>
          <!---->

          <!---->
          ${pattern.reference('example-wireframe:sandbox').render()}
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
  requestCapture({ result, resize }): void {
    this.captureing = true;
    this.requestUpdate();

    // +
    requestAnimationFrame(async () => {
      const target = this;
      // const target = this.shadowRoot.querySelector('.host-node.sandbox > *');
      const targetCapture = capture(target, {
        result,
        resize,
      });

      // +
      const file = await targetCapture();
      this.saveAs(file.blob, `${new Date().toUTCString()}.png`);

      // +
      this.captureing = false;
      this.requestUpdate();
    });
  }

  saveAs(blob, filename) {
    const node = document.createElement('a');
    document.body.appendChild(node);

    node.href = URL.createObjectURL(blob);
    node.download = filename;
    node.click();

    URL.revokeObjectURL(node.href);
    document.body.removeChild(node);
  }
}
