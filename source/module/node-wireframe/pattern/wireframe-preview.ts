import { css, html, pattern, nothing } from '@applicdev/module-lit';

import './wireframe-preview-grid';

pattern.reference('node-wireframe:preview').create({
  styles: (host, node) => css`
    ${pattern.reference('node-wireframe:preview-grid').styles()}
    ${pattern.reference('node-wireframe:preview-grid-cell').styles()}

    /**/
    .host-node.preview-button {
      display: flex;
      flex-direction: row;
      flex: none;
      align-items: center;

      cursor: pointer;
      height: 2rem;
      padding: 0rem var(--node-gutter);
    }

    .host-node.preview {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .host-node.preview > .preview-inner {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    /**/
    .host-node.preview-none {
      display: flex;
      flex-direction: column;
      flex: auto;
      align-items: center;
      justify-content: center;
    }

    /**/
    .host-node.preview-section {
      display: flex;
      flex-direction: column;
      flex: none;

      margin: 0rem 0rem var(--node-margin);
    }
    .host-node.preview-section > *:not(:last-child) {
      margin: 0rem 0rem var(--node-gutter);
    }

    .host-node.preview-section > .preview-section-bar {
      display: flex;
      flex-direction: row;
      flex: none;
      align-items: center;

      height: 1.875rem;
      padding: 0rem var(--node-gutter);
    }
    .host-node.preview-section > .preview-section-inner {
      position: relative;

      display: flex;
      flex-direction: column;
      flex: none;

      padding: var(--node-gutter) var(--node-gutter);

      border: 0rem solid;
      border-radius: var(--tone-border-corner);
      background: var(--tone-backdrop-dim);
    }
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      <div class="preview-inner">
        ${host.sandbox && host.sandbox.patternRender[0].state != 0
          ? ((nodes) => {
              return pattern //
                .reference('node-wireframe:preview-grid')
                .render(host, { nodes });
            })(host.sandbox.patternRender[0].nodes)
          : html`
              <!---->
              <div class="host-node preview-none">
                <span class="node-type description-sm">Selected elements will be displayed here</span>
              </div>
              <!---->
            `}
      </div>
      <!---->
    </div>
  `,
});