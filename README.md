```[🔖] the flowing is a draft document; last updated on January 9, 2022```

<br>

## Overview

If you found this by searching for my code snippets – Hello there, SRH! ^^ – I'm just a little brainstorming in advance...

<br>


## Implementation

<br>

**Capture of an existing element –**

```typescript
 
import { htmlCapture } from '@milotheirself/module-html-capture';

// +
htmlCapture
  .capture(globalThis.document.body)({
		// [...]
	})
  .then((result) => {
    console.log(result);

    // [...]
  });
  
```

<br>

**Capture of a dynamic template –**

```typescript
 
import { html, nothing, TemplateResult } from 'lit';
import { htmlCapture } from '@milotheirself/module-html-capture';

// +
type templateOptions = {
  greeting: string;
  name: string;
  caption: TemplateResult | null;
};

// +
const template = (options: templateOptions) => html`
  <div style="color: #e65454;">
    <!---->
    <h1>${options.greeting}, ${options.name}!</h1>
    ${options.caption ? html`<p>${options.caption}</p>` : nothing}
    <!---->
  </div>
`;

// +
htmlCapture
  .capture(template)([
    // frame 1
    {
      greeting: 'Hello',
      name: 'World',
      caption: null,
    },

    // frame 2
    {
      greeting: 'And hello',
      name: 'GitHub',
      caption: 'These are HTML-snippets turning into an PNG image format–',
    },

    // ...
  ])
  .then((result) => {
    console.log(result);

    // [...]
  });
  
```

<!--
### Contributing
[...]
-->
