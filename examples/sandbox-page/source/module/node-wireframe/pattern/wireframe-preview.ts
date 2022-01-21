import { css, html, pattern, nothing } from '@applicdev/module-lit';

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
    }
  `,
  render: (host, node) => html`
    <div class="host-node preview">
      <!---->
      <div class="preview-inner">
        ${host.sandbox
          ? [...Object.values(host.sandbox.pattern).filter((pat: any) => pat.state == 2)].map(
              (ref: any) => html`
                <!---->
                ${ref.nonce}
                <!---->
              `
            )
          : nothing}
      </div>
      <!---->
    </div>
  `,
});
