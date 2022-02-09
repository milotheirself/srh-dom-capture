import { css, html, pattern, nothing } from '@applicdev/applic-dev';

const internal: { [prop: string]: any } = {};

pattern.reference('node-wireframe:sandbox-node').create({
  styles: (host, node) => css`
    /**/
    .host-node.sandbox-checkbox {
      display: flex;
      flex-direction: row;
      flex: none;
      align-items: center;

      height: 1.875rem;
      margin: 0rem 0rem 0rem calc(0rem - var(--node-gutter));
      padding: 0rem var(--node-gutter);

      cursor: pointer;
    }

    .host-node.sandbox-checkbox input[checked] {
      opacity: 1;
    }
    .host-node.sandbox-checkbox input[checked]:not([all-checked]) {
      opacity: 0.5;
    }

    .host-node.sandbox-checkbox > * {
      margin: 0rem 0rem;

      user-select: none;
      pointer-events: none;
    }
    .host-node.sandbox-checkbox > *:not(:last-child) {
      margin: 0rem var(--node-gutter) 0rem 0rem;
    }
  `,
  render: (host, node) => html`
    <label class="host-node sandbox-checkbox" node-nonce="${node.nonce}" @click="${host.sandbox.onAction.bind(host.sandbox)}" @keydown="${host.sandbox.onAction.bind(host.sandbox)}">
      <input type="checkbox" ?checked="${node.state >= 1}" ?all-checked="${node.state >= 2 || !node.nodes.length}" />
      <span class="node-type action">${node.label}</span>
    </label>
    ${node.nodes.length
      ? html`
          <!---->
          <ul>
            ${node.nodes.map(
              (nodeChild) => html`
                <!---->
                <li>
                  ${pattern //
                    .reference('node-wireframe:sandbox-node')
                    .render(host, nodeChild)}
                </li>
                <!---->
              `
            )}
          </ul>
          <!---->
        `
      : nothing}
  `,
});

pattern.reference('node-wireframe:sandbox').create({
  styles: (host, node) => css`
    ${pattern.reference('node-wireframe:sandbox-node').styles(host, node)}

    /**/
    .host-node.sandbox {
      dispaly: flex;
      flex-direction: column;
    }

    /**/
    .host-node.sandbox-header {
      display: flex;
      flex-direction: column;
      flex: none;

      margin: 0rem 0rem var(--node-margin);
    }

    .host-node.sandbox-header ul {
      margin: 0rem 0rem;
      padding: 0rem 0rem 0rem var(--node-margin);
    }
    .host-node.sandbox-header li {
      margin: 0rem 0rem;
      padding: 0rem 0rem;
      list-style: none;
    }
  `,
  render: (host, node) => html`
    <div class="host-node sandbox">
      <!---->
      <div class="host-node sandbox-header">
        ${host.sandbox
          ? [...host.sandbox.patternRender].map(
              (nodePattern) => pattern.reference('node-wireframe:sandbox-node').render(host, nodePattern) //
            )
          : nothing}
      </div>
      <!---->
    </div>
  `,
});
