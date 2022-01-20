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

    .host-node.preview {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .host-node.preview > .preview-inner {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      <div class="preview-inner">
        ${host.preview && host.preview.captureing
          ? html`<node-loader node-active="true"></node-loader>`
          : html`
              <!---->
              <!---->
            `}
      </div>
      <!---->
    </div>
  `,
});
