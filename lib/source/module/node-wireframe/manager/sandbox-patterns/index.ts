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
            <p>
              <span style="background: var(--palette-yellow-lit)"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span> Etiam vehicula dui sit amet elit tincidunt cursus. Quisque
              consectetur feugiat lacus, nec condimentum erat aliquam et.
            </p>
            <p>
              Vivamus condimentum ut arcu eu finibus. <span style="background: var(--palette-green-lit)">Sed faucibus, erat eget pretium commodo,</span>arcu libero pellentesque sem, vel viverra nisi
              est vel orci. In lacus neque, dignissim nec ipsum id, dignissim pharetra ligula. Aenean blandit est vel velit feugiat lobortis. Morbi fringilla lacinia neque porta semper.
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

              font-family: Arial;
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
              object-position: center;
              background-size: cover;
              background-position: center;
            }
            .node-sandbox.common-images > .common-images-cell > span {
              margin: 10px auto 0rem;

              font-family: Arial;
              font-size: 15px;
            }
          </style>

          <div class="node-sandbox common-images">
            <!---->
            <div class="common-images-cell">
              <img src="./assets/image/jamie-street-Zqy-x7K5Qcg-unsplash.jpg" />
              <span>image element</span>
            </div>
            <!---->

            <!---->
            <div class="common-images-cell">
              <div style="background-image: url('./assets/image/jamie-street-Zqy-x7K5Qcg-unsplash.jpg');"></div>
              <span>background image</span>
            </div>
            <!---->
          </div>
        `;
      }

      // +
      case 'sandbox-debug:common-overflow': {
        return html`
          <!---->
          <style>
            .node-sandbox.common-overflow {
              display: flex;
              flex-direction: row;
              flex: none;
            }

            .node-sandbox.common-overflow > .common-overflow-cell {
              display: block;
              flex: 1;
              height: 240px;
            }
            .node-sandbox.common-overflow > .common-overflow-cell:not(:last-child) {
              margin-right: var(--node-margin);
            }

            .node-sandbox.common-overflow > .common-overflow-cell > * {
              display: flex;
              flex-direction: row;
              flex: none;

              min-width: 100%;
              min-height: 100%;

              align-items: center;
              justify-content: center;
            }
            .node-sandbox.common-overflow > .common-overflow-cell span {
              padding: 5px;

              font-family: Arial;
              font-size: 15px;
            }
          </style>

          <div class="node-sandbox common-overflow">
            <!---->
            <div class="common-overflow-cell" style="overflow: hidden scroll;">
              <div style="width: 100%; height: 300px;">
                <span style="background: var(--palette-copper-lit)"> hidden, scroll</span>
              </div>
            </div>
            <!---->

            <!---->
            <div class="common-overflow-cell" style="overflow: scroll hidden;">
              <div style="width: 300px; height: width: 100%;">
                <span style="background: var(--palette-yellow-lit)">scroll, hidden</span>
              </div>
            </div>
            <!---->

            <!---->
            <div class="common-overflow-cell" style="overflow: scroll scroll;">
              <div style="width: 300px; height: 300px;">
                <span style="background: var(--palette-indigo-lit)">scroll, scroll</span>
              </div>
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

              width: 100%;
              overflow: auto auto;
            }

            .node-sandbox.common-tables table {
              border-collapse: collapse;
              border-spacing: 0;
            }
            .node-sandbox.common-tables table td,
            .node-sandbox.common-tables table th {
              padding: 0.25em;
              border: 1px solid #999;

              font-size: 0.925em;
              font-weight: normal;
              white-space: nowrap;
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
          <style>
            .node-sandbox.common-inputs {
              display: flex;
              flex-direction: row;
              felx-wrap: wrap;

              font-family: Arial;
            }

            .node-sandbox.common-inputs > .common-inputs-cell {
              width: 240px;
            }
            .node-sandbox.common-inputs > .common-inputs-cell > *:first-child {
              display: flex;
              flex-direction: column;
              flex: none;

              overflow: hidden;
            }
            .node-sandbox.common-inputs > .common-inputs-cell > legend {
              font-family: Arial;
              font-size: 15px;
            }
          </style>

          <div class="node-sandbox common-inputs">
            <!---->
            <fieldset class="common-inputs-cell">
              <legend>file-type</legend>
              <div>
                <input type="file" />
              </div>
            </fieldset>

            <fieldset class="common-inputs-cell">
              <legend>text-type</legend>
              <div>
                <input type="text" value="Hello, World!" />
              </div>
            </fieldset>

            <fieldset class="common-inputs-cell">
              <legend>password-type</legend>
              <div>
                <input type="password" value="password123" />
              </div>
            </fieldset>
            <!---->
          </div>
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
