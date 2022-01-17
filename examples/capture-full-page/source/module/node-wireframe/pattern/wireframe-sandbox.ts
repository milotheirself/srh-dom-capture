import { css, html, pattern } from '@applicdev/module-lit';

pattern.reference('node-wireframe:sandbox').create({
  styles: (host, node) => css`
    /**/
    .host-node.sandbox {
      dispaly: flex;
      flex-direction: column;
    }

    /**/
    .host-node.sandbox-header {
      display: flex;
      flex-direction: row;
      flex: none;

      margin: 0rem 0rem var(--node-margin);
    }

    /**/
    .host-node.sandbox-checkbox {
      display: flex;
      flex-direction: row;
      flex: none;
      align-items: center;

      height: 2rem;
      margin: 0rem var(--node-gutter) 0rem 0rem;
      padding: 0rem var(--node-gutter);

      cursor: pointer;
    }
    .host-node.sandbox-checkbox > *[type='checkbox'] {
      margin: 0rem var(--node-gutter-sm) 0rem 0rem;
    }
    .host-node.sandbox-checkbox > * {
      user-select: none;
      pointer-events: none;
    }
  `,
  render: (host, node) => html`
    <div class="host-node sandbox">
      <!---->
      <div class="host-node sandbox-header">
        ${[
          { title: 'All', value: '', active: true }, //
          { title: 'Text', value: 'text-elments', active: true },
          { title: 'Images', value: 'image-elments', active: true },
        ].map(
          (node) => html`
            <label class="host-node sandbox-checkbox">
              <input type="checkbox" value="${node.value}" ?checked="${node.active}" />
              <span class="node-type action">${node.title}</span>
            </label>
          `
        )}
      </div>
      <div>
        <span class="node-type body">Hello, World! 👋</span>
      </div>
      <!---->
    </div>
  `,
});
