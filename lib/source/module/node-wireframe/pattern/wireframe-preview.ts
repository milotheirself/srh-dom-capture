import { css, html, pattern, nothing } from '@applicdev/dev';

import './wireframe-preview-grid';

pattern.reference('node-wireframe:preview').create({
  styles: (host, node) => css`
    ${pattern.reference('node-wireframe:preview-grid').styles()}
    ${pattern.reference('node-wireframe:preview-grid-cell').styles()}

    /**/
    .host-node.preview {
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
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      ${host.sandbox && host.sandbox.patternRender[0].state != 0
        ? ((nodes) => {
            return pattern //
              .reference('node-wireframe:preview-grid')
              .render(host, { nodes });
          })(host.sandbox.patternRender[0].nodes)
        : html`
            <!---->
            <div class="host-node preview-none">
              <span class="node-type description-sm">Selected snippets will be displayed here</span>
            </div>
            <!---->
          `}
      <!---->
    </div>
  `,
});
