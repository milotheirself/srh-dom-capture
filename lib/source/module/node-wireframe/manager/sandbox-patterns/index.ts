import { css, html, pattern, nothing } from '@applicdev/dev';

pattern.reference('node-sandbox:patterns').create({
  styles: (host, node) => css``,
  render: (host, node) => {
    switch (node.nonce) {
      // +
      case 'sandbox-debug:common-texts': {
        return html`
          <!---->
          <style>
            .node-sandbox.common-text {
              display: flex;
              flex-direction: column;

              font-family: monospace;
            }
            .node-sandbox.common-text > *:first-child {
              margin-top: var(--node-gutter);
            }
            .node-sandbox.common-text > *:last-child {
              margin-bottom: var(--node-gutter);
            }
          </style>

          <div class="node-sandbox common-text">
            <!---->
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vehicula dui sit amet elit tincidunt cursus. Quisque consectetur feugiat lacus, nec condimentum erat aliquam et.</p>
            <p>
              Vivamus condimentum ut arcu eu finibus. Sed faucibus, erat eget pretium commodo, arcu libero pellentesque sem, vel viverra nisi est vel orci. In lacus neque, dignissim nec ipsum id,
              dignissim pharetra ligula. Aenean blandit est vel velit feugiat lobortis. Morbi fringilla lacinia neque porta semper.
            </p>
          </div>
          <!---->

          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }

      // +
      case 'sandbox-debug:common-images': {
        return html`
          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }

      // +
      case 'sandbox-debug:common-inputs': {
        return html`
          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }

      // +
      case 'sandbox-debug:custom': {
        return html`
          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }

      // +
      case 'sandbox-debug:custom-lit-elements': {
        return html`
          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }

      // +
      case 'sandbox-debug:custom-lit-expressions': {
        return html`
          <!---->
          <pre>${JSON.stringify(node, null, 2)}</pre>
          <!---->
        `;
      }
    }
  },
});
