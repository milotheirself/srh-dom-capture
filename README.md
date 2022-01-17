<br>

`[🔖] the flowing is a draft document; last updated on Monday, 17 January 2022`

<br>

Rasterize common HTML elements and [Lit](https://github.com/lit/lit)'s HTML templates

![GitHub](https://img.shields.io/github/license/MiloTheirself/module-lit-capture?label=License)
![GitHub issues](https://img.shields.io/github/issues/MiloTheirself/module-lit-capture?label=Issues)
![Discord](https://img.shields.io/discord/494388532270465024?label=Discord)

[...]

<br>

<!--## Documentation

Full documentation is available at [applic.dev](https://applic.dev/outline/module-lit-capture).

<br>-->

## Overview

[...]

<br>

## Usage

This module allows you to easily capture the entire browser page,

```typescript
import * as litCapture from '@milotheirself/module-lit-capture';

litCapture.capture().then((result) => console.log);
```

a specific element,

```typescript
import * as litCapture from '@milotheirself/module-lit-capture';

litCapture
  .capture({
    target: globalThis.document.querySelector('my-custom-element')!,
    option: {
      capture: { dpr: 1.25, inset: '2.5rem', background: '#eaeaea' },
      resolve: { dpr: 3 },
    },
  })
  .then((result) => console.log);
```

or [lit expressions](https://lit.dev/docs/templates/expressions/) with dynamic parameters.

```typescript
import { html, css, nothing } from 'lit';
import { context } from '@milotheirself/module-html-capture';
import * as litCapture from '@milotheirself/module-lit-capture';

const myAwesomeTemplate = {
  styles: () => css`
    :host {
      /* if you want, you can even style the capture root here~ */
    }
    .my-template {
      padding: 1em 1em;
    }
    .my-template * {
      text-align: center;
      color: #212121;
    }
  `,
  render: ({ greeting, caption }) => html`
    <div class="my-template">
      <h2>${greeting.join(', ')}!</h2>
      ${caption ? html`<p>${caption}</p>` : nothing}
    </div>
  `,
};

litCapture
  .capture({
    target: myAwesomeTemplate,
    option: {
      capture: { dpr: 1.25, inset: '2.5rem', background: '#eaeaea' },
      resolve: { dpr: 3 },
    },
    render: [
      {
        greeting: ['Hello', 'World'],
      },
      {
        greeting: ['And hello', 'GitHub'],
        caption: 'These are HTML-snippets turning into an PNG image format–',
      },
    ],
  })
  .then((result) => console.log);
```

<!--### Contributing

Please see [CONTRIBUTING.md]().-->
