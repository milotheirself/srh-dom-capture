<br>

`[🔖] the flowing is a draft document; last updated on Monday, 20 January 2022`

<br>

Rasterize common HTML elements, LitElements, and Lit's template expressions

![GitHub](https://img.shields.io/github/license/MiloTheirself/module-lit-capture?label=License)
![GitHub issues](https://img.shields.io/github/issues/MiloTheirself/module-lit-capture?label=Issues)
![Discord](https://img.shields.io/discord/494388532270465024?label=Discord)

<details>
<summary>Contents</summary>
<ul> 
  <li><a href="#Documentation">Documentation</a></li>
  <li><a href="#Usage">Usage</a></li>
</ul>
</details>  

<br>

[...]

<br>

## Documentation

See the full documentation in our [Wiki](https://github.com/MiloTheirself/module-lit-capture/wiki/Introduction).

## Usage

Capture an entire browser page,

```typescript
import { capture } from '@applicdev/module-lit-capture';

capture().then((result) => console.log);
```

a specific element,

```typescript
import { capture } from '@applicdev/module-lit-capture';

capture({
  target: globalThis.document.querySelector('my-custom-element')!,
  option: {
    capture: { dpr: 1.25, inset: '2.5rem', background: '#eaeaea' },
    resolve: { dpr: 3 },
  },
}).then((result) => console.log);
```

or Lit's [css](https://lit.dev/docs/components/styles/) and [html](https://lit.dev/docs/templates/expressions/) expressions with dynamic parameters.

```typescript
import { css, html, nothing } from 'lit';
import { capture } from '@applicdev/module-lit-capture';

const myCustomTemplate = {
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

capture({
  target: myCustomTemplate,
  option: { capture: { dpr: 3 } },
  render: [
    {
      greeting: ['Hello', 'World'],
    },
    {
      greeting: ['And hello', 'GitHub'],
      caption: 'These are simple snippets being rasterized–',
    },
  ],
}).then((result) => console.log);
```

<!--### Contributing

Please see [CONTRIBUTING.md]().-->
