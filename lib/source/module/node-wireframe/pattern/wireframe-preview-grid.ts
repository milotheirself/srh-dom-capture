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
    .host-node.preview-grid-cell .cell-figure {
      display: flex;
      flex-direction: column;
      flex: none;

      margin: 0rem 0rem;
      padding: var(--node-gutter) var(--node-margin);

      border: 0rem solid;
      border-radius: var(--tone-border-corner);
      background: var(--tone-backdrop-drk);
    }
    .host-node.preview-grid-cell .cell-figure > * {
      display: flex;
      flex-direction: column;
      flex: none;

      filter: blur(0px) opacity(1);
    }
    .host-node.preview-grid-cell .cell-figure[node-unresolved] > * {
      filter: blur(2px) opacity(0.6);
      pointer-events: none;
    }

    /**/
    .host-node.preview-grid-cell .cell-actions,
    .host-node.preview-grid-cell .cell-caption {
      display: flex;
      flex-direction: row;
      flex-wrap: column;

      margin: 0rem calc(0rem - var(--node-gutter-sm) / 2);
      padding: 0rem var(--node-gutter);
    }
    .host-node.preview-grid-cell .cell-actions > *,
    .host-node.preview-grid-cell .cell-caption > * {
      margin: 0rem calc(var(--node-gutter-sm) / 2) 0rem calc(var(--node-gutter-sm) / 2);
      color: var(--tone-type-dim);
    }
    .host-node.preview-grid-cell .cell-caption > *:last-child {
      color: var(--tone-type);
    }
  `,
  render: (host, node) => html`
    <div class="host-node preview-grid-cell">
      <!---->
      <div class="grid-node wireframe-row">
        <!---->
        <div class="wireframe-row-inner">
          <div class="cell-caption">
            ${[
              ...node.label, //
            ].map((lab, i) =>
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
        </div>
        <!---->

        <!---->
        <div class="wireframe-row-inner">
          <div class="cell-actions">
            ${node.nonce in host.preview.captureing
              ? html` <node-loader node-active="true"></node-loader>`
              : html`
                  <!---->
                  <label class="wireframe-node action" @click="${host.preview.requestCapture.bind(host.preview, { pattern: node })}">
                    <span class="node-type action">Capture</span>
                  </label>
                  <!---->
                `}
          </div>
        </div>
        <!---->
      </div>
      <!---->

      <!---->
      <figure class="cell-figure" node-capture-target="${node.nonce}" ?node-unresolved="${node.nonce in host.preview.captureing}">
        <div>
          <!---->
          ${pattern.reference('node-sandbox:patterns').render(host, node)}
          <!---->
        </div>
      </figure>
      <!---->
    </div>
  `,
});
