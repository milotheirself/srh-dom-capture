import { css, html, pattern, nothing } from '@applicdev/dev';

pattern.reference('node-wireframe:preview-grid').create({
  styles: (host, node) => css`
    /**/
    .host-node.preview-grid-row {
      margin: 0rem 0rem var(--node-gutter);
      padding: 0rem var(--node-gutter);
    }
    .host-node.preview-grid-row:not(:first-child) {
      margin: var(--node-margin) 0rem var(--node-gutter);
    }

    /**/
    .host-node.preview-grid {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      margin: 0rem calc(0rem - var(--node-margin) / 2);
    }
    .host-node.preview-grid:first-child {
      margin-top: calc(0rem - var(--node-gutter) / 2);
    }
    .host-node.preview-grid:last-child {
      margin-bottom: calc(0rem - var(--node-gutter) / 2);
    }

    /**/
    .host-node.preview-grid > * {
      width: min(calc(100% - var(--node-margin)), 51.25rem);
      margin: calc(var(--node-gutter) / 2) calc(var(--node-margin) / 2);

      overflow: hidden;
    }
  `,
  render: (host, node) => html`
    <!---->
    ${node.nodes
      .filter((sec: any) => sec.state >= 1)
      .map(
        (section) => html`
          <div class="host-node preview-grid">
            ${section.nodes
              .filter((sec: any) => sec.state >= 1)
              .map(
                (pat) => html`
                  <!---->
                  ${pattern.reference('node-wireframe:preview-grid-cell').render(host, {
                    nonce: pat.nonce,
                    label: [section.label, pat.label],
                  })}
                  <!---->
                `
              )}
          </div>
        `
      )}
    <!---->
  `,
});

pattern.reference('node-wireframe:preview-grid-cell').create({
  styles: (host, node) => css`
    /**/
    .host-node.preview-grid-cell {
      display: flex;
      flex-direction: column;
      flex-wrap: column;
      flex: none;
    }

    /**/
    .host-node.preview-grid-cell > .cell-figure {
      margin: 0rem 0rem;
      padding: 0rem 0rem;

      border: 0rem solid;
      border-radius: var(--tone-border-corner);
      background: var(--tone-backdrop-drk);
    }

    /**/
    .host-node.preview-grid-cell > .cell-caption {
      display: flex;
      flex-direction: row;
      flex-wrap: column;
      align-items: center;

      height: 1.875rem;
      padding: 0rem var(--node-gutter);
    }
    .host-node.preview-grid-cell > .cell-caption > * {
      margin: 0rem var(--node-gutter-sm) 0rem 0rem;
      color: var(--tone-type-dim);
    }
    .host-node.preview-grid-cell > .cell-caption > *:last-child {
      color: var(--tone-type);
    }
  `,
  render: (host, node) => html`
    <!---->
    <div class="host-node preview-grid-cell">
      <!---->
      <div class="cell-caption">
        ${node.label.map((lab, i) =>
          i == node.label.length - 1
            ? html`
                <!---->
                <span class="node-type description-sm">${lab}</span>
                <!---->
              `
            : html`
                <!---->
                <span class="node-type description-sm">${lab}</span>
                <span class="node-type description-sm"> › </span>
                <!---->
              `
        )}
      </div>
      <!---->

      <!---->
      <figure class="cell-figure">
        <pre>${JSON.stringify(node, null, 2)}</pre>
      </figure>
      <!---->
    </div>
    <!---->
  `,
});
