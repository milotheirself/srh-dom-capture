import { css, html, pattern } from '@applicdev/module-lit';

pattern.reference('node-wireframe:preview').create({
  styles: (host, node) => css`
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
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      <div class="grid-node wireframe-action-row">
        <div class="wireframe-action-row-inner"></div>
        <div class="wireframe-action-row-inner">
          ${host.preview && host.preview.captureing
            ? html`<node-loader node-active="true"></node-loader>`
            : html`
                <button class="host-node preview-button" @click="${host.requestDownload.bind(host, { type: 'png' })}">
                  <span class="node-type action">Export as PNG</span>
                </button>
              `}
        </div>
      </div>
      <!---->
    </div>
  `,
});
