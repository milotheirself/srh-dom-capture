import { pattern, css, html, customElement, LitElement } from '@applicdev/module-lit';

import { default as previewManager } from './manager/preview';
import { default as sandboxManager } from './manager/sandbox';

import './pattern/wireframe-preview';
import './pattern/wireframe-sandbox';

@customElement('example-wireframe')
export class ExampleWireframe extends LitElement {
  static styles = [
    // +
    pattern.reference('node-common').styles(),
    pattern.reference('node-wireframe:sandbox').styles(),
    pattern.reference('node-wireframe:preview').styles(),

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

        padding: var(--node-gutter) var(--node-margin);
      }
      .host-node.wireframe > .wireframe-inner {
        display: relative;

        display: flex;
        flex-direction: column;
        flex: auto;
      }
      .host-node.wireframe > .wireframe-inner:not(:first-child) {
        margin: 0rem 0rem 0rem var(--node-margin);
      }
    `,
  ];

  render() {
    return [
      // +
      html`
        <!---->
        <div class="host-node wireframe">
          <div class="wireframe-inner">
            <!---->
            ${pattern.reference('node-wireframe:sandbox').render(this, {})}
            <!---->
          </div>

          <div class="wireframe-inner">
            <!---->
            ${pattern.reference('node-wireframe:preview').render(this, {})}
            <!---->
          </div>
        </div>
        <!---->
      `,
    ];
  }

  // +
  firstUpdated(): void {
    sandboxManager.create(this);
    previewManager.create(this);
  }

  // +
  updated(): void {}

  // +
  requestDownload({ type }) {
    console.log(type);
  }
}
