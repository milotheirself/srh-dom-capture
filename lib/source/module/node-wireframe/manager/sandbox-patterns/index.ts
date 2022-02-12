import { css, html, pattern, nothing } from '@applicdev/applic-dev';

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
        `;
      }

      // +
      case 'sandbox-debug:common-images': {
        return html`
          <!---->
          <style>
            .node-sandbox.common-images {
              display: flex;
              flex-direction: row;
            }

            .node-sandbox.common-images > .common-images-cell {
              display: flex;
              flex-direction: column;
              flex: auto;

              width: 50%;
            }
            .node-sandbox.common-images > .common-images-cell > *:first-child {
              height: 300px;
              width: 100%;

              object-fit: cover;
              background-size: cover;
            }
          </style>

          <div class="node-sandbox common-images">
            <!---->
            <div class="common-images-cell">
              <img src="/example/assets/image/omid-armin--eqZRQ_XP2A-unsplash.jpg" />
              <span>image element</span>
            </div>
            <!---->

            <!---->
            <div class="common-images-cell">
              <div style="background-image: url('/example/assets/image/omid-armin--eqZRQ_XP2A-unsplash.jpg');"></div>
              <span>background image</span>
            </div>
            <!---->
          </div>
        `;
      }

      // +
      case 'sandbox-debug:common-tables': {
        return html`
          <style>
            .node-sandbox.common-tables {
              display: flex;
              flex-direction: row;
            }

            .node-sandbox.common-tables table {
              border-collapse: collapse;
              border-spacing: 0;

              width: 100%;
            }
            .node-sandbox.common-tables table td,
            .node-sandbox.common-tables table th {
              padding: 0.25em;
              border: 1px solid #999;

              font-size: 0.925em;
              font-weight: normal;
            }
            .node-sandbox.common-tables table b {
              font-weight: bold;
            }
            .node-sandbox.common-tables table td {
              text-align: center;
            }
            .node-sandbox.common-tables table th {
              text-align: left;
              background-color: var(--palette-gray-lit);
            }
          </style>

          <!---->
          <div class="node-type node-sandbox common-tables">
            ${(({ times, lists }) => html`
              <table>
                <thead>
                  <tr>
                    <td></td>
                    ${times.map((tim) =>
                      tim
                        ? html`
                            <!---->
                            <th scope="col">${tim.join(' - ')}</th>
                            <!---->
                          `
                        : nothing
                    )}
                  </tr>
                </thead>
                <tbody>
                  ${lists.map(
                    (lis) => html`
                      <!---->
                      <tr>
                        <th colspan="${times.length + 1}" scope="colgroup"><b>${lis.title}</b></th>
                      </tr>
                      ${lis.rooms.map(
                        (roo) => html`
                          <tr>
                            <th scope="rowgroup">${roo.title}</th>
                            ${(() => {
                              const tasList = [];

                              for (let i = 0; i < times.length; i++) {
                                let tas = roo.tasks.filter((tas) => tas.times[0] == i)[0];
                                if (tas) {
                                  i += tas.times[1] - tas.times[0];
                                  tasList.push(html`<td colspan="${tas.times[1] - tas.times[0] + 1}" style="background:${tas.color};">${tas.title}</td>`);
                                } else {
                                  tasList.push(html`<td></td>`);
                                }
                              }

                              return tasList;
                            })()}
                          </tr>
                        `
                      )}
                      <!---->
                    `
                  )}
                </tbody>
              </table>
            `)({
              times: [
                ['8:00', '8:45'],
                ['8:55', '9:40'],
                ['9:40', '10:25'],
                ['10:35', '11:20'],
                ['11:20', '12:05'],
                ['13:05', '13:50'],
                ['13:50', '14:35'],
                ['14:45', '15:30'],
                ['15:30', '16:15'],
                ['16:20', '17:10'],
                ['17:20', '18:05'],
              ],
              lists: [
                {
                  title: 'Monday',
                  rooms: [
                    {
                      title: '206',
                      tasks: [
                        { times: [3, 4], color: 'var(--palette-indigo-lit)', title: 'NET' }, //
                        { times: [5, 6], color: 'var(--palette-green-lit)', title: 'ITSI' }, //
                        { times: [7, 8], color: 'var(--palette-blue-lit)', title: 'SWT' }, //
                      ],
                    },
                    {
                      title: '308',
                      tasks: [
                        { times: [1, 2], color: 'var(--palette-yellow-lit)', title: 'WISO' }, //
                      ],
                    },
                  ],
                },
                {
                  title: 'Tuesday',
                  rooms: [
                    {
                      title: '206',
                      tasks: [
                        { times: [1, 3], color: 'var(--palette-indigo-lit)', title: 'NET' }, //
                        { times: [4, 4], color: 'var(--palette-copper-lit)', title: 'DBK' }, //
                      ],
                    },
                    {
                      title: html`<abbr title="Online">Onl.</abbr>`,
                      tasks: [
                        { times: [5, 8], color: 'var(--palette-purple-lit)', title: 'JAVA' }, //
                      ],
                    },
                  ],
                },
                {
                  title: 'Wednesday',
                  rooms: [
                    {
                      title: '206',
                      tasks: [
                        { times: [3, 4], color: 'var(--palette-copper-lit)', title: 'DBK' }, //
                      ],
                    },
                    {
                      title: '418',
                      tasks: [
                        { times: [1, 2], color: 'var(--palette-blue-lit)', title: 'MAT' }, //
                      ],
                    },
                  ],
                },
              ],
            })}
            <!---->
          </div>
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
