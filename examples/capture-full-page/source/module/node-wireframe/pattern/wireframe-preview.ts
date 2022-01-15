import { css, html, pattern } from '@applicdev/module-lit';

pattern.reference('node-wireframe:preview').create({
  styles: (host, node) => css`
    /**/
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      <div class="grid-node wireframe-action-row">
        <div class="wireframe-action-row-inner"></div>
        <div class="wireframe-action-row-inner">
          <span class="node-type description-sm"
            >Export as <a href="#" @click="${host.requestDownload.bind(host, { type: 'png' })}">PNG</a> or <a href="#" @click="${host.requestDownload.bind(host, { type: 'pdf' })}">PDF</a></span
          >
        </div>
      </div>
      <!---->
    </div>
  `,
});
