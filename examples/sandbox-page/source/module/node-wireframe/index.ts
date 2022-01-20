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

      /**/
      .host-node.wireframe {
        position: absolute;
        inset: 0rem 0rem;

        display: flex;
        flex-direction: row;
      }

      /**/
      .host-node.wireframe > .wireframe-aside,
      .host-node.wireframe > .wireframe-inner {
        display: flex;
        flex-direction: column;

        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .host-node.wireframe > .wireframe-aside::-webkit-scrollbar,
      .host-node.wireframe > .wireframe-inner::-webkit-scrollbar {
        display: none;
      }

      .host-node.wireframe > .wireframe-aside {
        flex: none;
        width: 20rem;
        padding: var(--node-gutter) var(--node-margin);
      }

      .host-node.wireframe > .wireframe-inner {
        flex: 1;
        padding: var(--node-gutter) var(--node-margin) var(--node-gutter) 0rem;
      }
    `,
  ];

  render() {
    return [
      // +
      html`
        <!---->
        <div class="host-node wireframe">
          <div class="wireframe-aside">
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
  sandbox: any;
  preview: any;
  firstUpdated(): void {
    this.sandbox = sandboxManager.create(this);
    this.preview = previewManager.create(this);
    this.requestUpdate();
  }
}
