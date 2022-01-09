<br>

`[🔖] the flowing is a draft document; last updated on January 9, 2022`

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
  .capture(globalThis.document.body)()
  .then((result) => console.log);
  
```

<br>

**Capture of a dynamic template –**

```typescript
 
import { html, nothing } from 'lit';
import { htmlCapture } from '@milotheirself/module-html-capture';

// +
const template = (option: any) => html`
  <div style="color: #e65454;">
    <!---->
    <h1>${option.greeting.join(', ')}!</h1>
    <!---->

    <!---->
    ${option.caption 
      ? html`<p>${option.caption}</p>` 
      : nothing
    }
    <!---->
  </div>
`;

// +
htmlCapture
  .capture(template)([
    // frame 1
    {
      greeting: ['Hello', 'World'], 
    },

    // frame 2
    {
      greeting: ['And hello', 'GitHub'],
      caption: 'These are HTML-snippets turning into an PNG image format–',
    },

    // frame n
    // { ... }
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
