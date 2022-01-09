import { default as parserInterpret } from './parser-interpret';
import { default as renderRaster } from '../render/render-raster';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* replicate  */

fragment.replica = ({ target, option, pledge }) => {
  // + pledges is a shared list of all asynchronous tasks running in the background
  pledge = pledge || [];

  // + nodes with no visible appearance will not be replicated
  if (!parserInterpret.visible({ target })) return { result: null };

  // + replicate the node itself
  const { result } = internal.imitate({ target, option, pledge });

  // + replicate the node's nested and shadow-nested children
  const { nested, shadow } = internal.inserts({ target, option, pledge });

  // + insert children and resolve shadow slots
  const insertNode = result.node.childNodes[0] || result.node;
  // ? if there is no enclosing container, insert in the container;
  //   otherwise, insert to the node itself.

  // + resolve shadow root
  if (shadow.length) {
    shadow.forEach((shadow) => {
      insertNode.appendChild(shadow.result.node);
    });

    // + slot nested root
    // ? the simplicity of this is amazing~
    result.node.querySelectorAll('slot').forEach((slotNode) => {
      const slot = slotNode.getAttribute('name');

      nested.forEach((nestedNode) => {
        // ---
        if (slot == nestedNode.insert) {
          slotNode.parentNode.insertBefore(nestedNode.result.node, slotNode);
        }
        // FIXME: what if there are multible slot-nodes with the same name attribute?
        //---
      });
    });
  }

  // + resolve nested root
  else {
    nested.forEach((nested) => {
      insertNode.appendChild(nested.result.node);
    });
  }

  // +
  const insert = target.node.getAttribute ? target.node.getAttribute('slot') : null;
  return { result, insert, pledge };
};

/**
 * replicate nested and shadow-nested children
 */
internal.inserts = ({ target, option, pledge }) => {
  const nestedTraverse = ({ nestedNodes }) =>
    [...(!nestedNodes || !nestedNodes.length ? [] : nestedNodes)]
      // + replicate
      .map((node) =>
        fragment.replica({
          target: { node }, //
          option,
          pledge,
        })
      )
      // + filter non-renderd
      .filter(({ result }) => result != null);

  return {
    nested: nestedTraverse({ nestedNodes: target.node?.childNodes }), //
    shadow: nestedTraverse({ nestedNodes: target.node?.shadowRoot?.childNodes }),
  };
};

/**
 * create a visual-copy of a node and its properties
 */
internal.imitate = ({ target, option, pledge }) => {
  // + reference slot nodes
  if (parserInterpret.hastype({ target, typ: ['slot'] })) {
    // ? because slot nodes are replaced, we return them as a reference
    return {
      result: {
        node: target.node.cloneNode(true),
        slot: target.node.getAttribute('name') || '',
      },
    };
  }

  // + create a blank node
  const result = parserInterpret.hastype({ target, typ: ['svg', 'img'] })
    ? // ? inline-svg must be converted to an image node; other image nodes may
      //   be converted too just for consistency
      { node: internal.replace({ target, pledge }).result.node, slot: null }
    : parserInterpret.hastype({
        target,
        typ: [
          ...['#text'],
          // ? #text-nodes, plain text, lack both styles and a bounding-box, but
          //   they also cannot have nested contents, so we clone as them are
        ],
      })
    ? { node: target.node.cloneNode(false), slot: null }
    : parserInterpret.hastype({
        target,
        typ: [
          ...['input', 'fieldset', 'legend'],
          // ? the appearance of input elements is determined by their closed
          //   shadow-root (and the browser's willingness to tell the truth)
          ...['table', 'tr', 'td', 'th', 'thead', 'tbody'],
          // ? tables can also beave strange; their style properties do not
          //   accurately represent how they appear when rendered
        ],
      })
    ? // ? for these special cases, we use identical element types.
      { node: document.createElement(target.node.nodeName) /* target.node.cloneNode(false) */, slot: null }
    : // ? for other nodes, divs are used to replicate them. this is not necessary,
      //   it simplify the SVG contents, as well as prevent injections
      { node: document.createElement('div'), slot: null };

  // + stylize
  internal.stylize({ target, result, option, pledge });

  // + inherit scroll offsets
  internal.offsets({ target, result, option, pledge });

  // + inherit values and attributes
  internal.inherit({ target, result, option, pledge });

  // // + when defined; call interface match function
  // try {
  //   if ('match' in option) option.match({ target, result, option, pledge });
  // } catch (error) {
  //   // ? throw is ignored; because any error can be caught from within option.match
  // }

  return { result };
};

/**
 * apply styles from one node to another node
 */
internal.stylize = ({ target, result, option, pledge }) => {
  // + if the node has no applicable styles, return
  if (!('style' in target.node)) return;

  // + fetch applied styles
  const pat = parserInterpret.applied({ target });
  const cur = parserInterpret.applied({ target: result });

  // + apply non-matching styles
  Object.values(pat.styles).forEach((ref: string) => {
    let val = pat.styles.getPropertyValue(ref);
    if (ref.indexOf('-') != 0 && val != cur.styles.getPropertyValue(ref)) {
      result.node.style.setProperty(ref, val);
    }
  });

  // + apply background-image as data url
  if (result.node.style.getPropertyValue('background-image') != 'none') {
    pledge.push(internal.pledge.backgroundImage({ target, result, option }));
  }
};

/**
 * offset children their parent's scroll position
 */
internal.offsets = ({ target, result }) => {
  // + if the node has no applicable styles, return
  if (!('style' in target.node)) return;

  // + apply offset with an enclosing container
  const { scroll, offset, bounds } = parserInterpret.applied({ target });

  let offsetY = offset[3] != 0 || offset[1] != 0;
  let offsetX = offset[0] != 0 || offset[2] != 0;

  if (offsetY || offsetX) {
    // + force sollbar to stay visable; replace 'auto' with 'scroll'
    result.node.style.setProperty('overflow-x', `${offsetY ? 'scroll' : 'hidden'}`);
    result.node.style.setProperty('overflow-y', `${offsetX ? 'scroll' : 'hidden'}`);

    // + create an enclosing container
    const child = {
      node: document.createElement('div'),
      wid: target.node.offsetWidth - offset[3] - (offsetX ? scroll.wid : 0),
      hei: target.node.offsetHeight - offset[0] - (offsetY ? scroll.hei : 0),
    };

    // ---
    child.node.style.setProperty('margin', `${offset.join('px ')}px`);
    child.node.style.setProperty('width', `${child.wid}px`);
    child.node.style.setProperty('height', `${child.hei}px`);
    child.node.style.setProperty('overflow', `hidden`);
    // FIXME: the layout properties of child.node are not the same as those of
    //        'result.node'; it works like this, but why; are they inherited, or
    //        is the layout forced by the properties of the nested elements?
    // ---

    // + create an enclosing container
    result.node.appendChild(child.node);
  }
};

/**
 * make an equal-functioning element
 */
internal.replace = ({ target, pledge }) => {
  const result = { node: document.createElement('div') };

  if (parserInterpret.hastype({ target, typ: ['svg'] })) {
    pledge.push(internal.pledge.vectorImage({ target, result }));
  }

  if (parserInterpret.hastype({ target, typ: ['img'] })) {
    pledge.push(internal.pledge.rasterImage({ target, result }));
  }

  return { result };
};

/**
 * apply values and attributes that effect an elements appearance
 */
internal.inherit = ({ target, result }) => {
  // + if the node has no applicable styles, return
  if (!('style' in target.node)) return;

  if (parserInterpret.hastype({ target, typ: ['td', 'th'] })) {
    const rowspan = target.node.getAttribute('rowspan');
    const colspan = target.node.getAttribute('colspan');

    // + apply table attributes
    if (rowspan) result.node.setAttribute('rowspan', rowspan);
    if (colspan) result.node.setAttribute('colspan', colspan);
    // [...]
  }

  if (parserInterpret.hastype({ target, typ: ['input'] })) {
    const type = target.node.getAttribute('type');

    // + apply input attributes
    if (type) result.node.setAttribute('type', type);

    // + apply input values
    if (target.node.checked) result.node.setAttribute('checked', '');
    // ---
    if (target.node.value) result.node.setAttribute('value', target.node.value);
    // FIXME: Copying plain input values is probably not a good idea...
    // ---
  }
};

/* asynchronous tasks */

internal.pledge = {};

/**
 * replace background-image url with data-url
 */
internal.pledge.vectorImage = ({ target, result }): Promise<void> => {
  return new Promise((resolve) => {
    //...
    resolve();
  });
};

/**
 * replace background-image url with data-url
 */
internal.pledge.rasterImage = ({ target, result }): Promise<void> => {
  return new Promise(async (resolve) => {
    // + apply canvas as data url
    // const urn = await internal.pledge.imgAsUrn({ img: target.node });
    const urn = await internal.pledge.urlAsUrn({ url: target.node.src });
    // ---
    result.node.style.setProperty('background-image', `url("${urn ? urn : 'none'}")`);
    // FIXME: render none; when invalid urn
    // ---

    // ---
    // + apply position and fit properties
    // result.node.style.setProperty('background-position', target.node.style.getPropertyValue('object-position'));
    // result.node.style.setProperty('background-size', target.node.style.getPropertyValue('object-fit'));
    // FIXME: properties do not get applied or overwritten
    // ---

    // + resolve pledge
    resolve();
  });
};

/**
 * replace background-image url with data-url
 */
internal.pledge.backgroundImage = ({ target, result }): Promise<void> => {
  return new Promise(async (resolve) => {
    // + apply canvas as data url
    const url = result.node.style.getPropertyValue('background-image').slice(5, -2);
    const urn = await internal.pledge.urlAsUrn({ url });
    // ---
    result.node.style.setProperty('background-image', `url("${urn ? urn : 'none'}")`);
    // FIXME: render none; when invalid urn
    // ---

    // + resolve pledge
    resolve();
  });
};

// ---
// /**
//  * replace image node url with data-url
//  */
// internal.pledge.imgAsUrn = ({ img }): Promise<void> => {
//   return new Promise((resolve) => {
//     // + image to canvas
//     const raster = renderRaster.blank({
//       wid: img.width,
//       hei: img.height,
//       typ: 'node',
//     });
//     raster.ctx.drawImage(img, 0, 0, img.width, img.height);

//     // + resolve pledge
//     resolve(raster.can.toDataURL('image/png'));
//   });
// };
// FIXME: image gets squashed; when image bounds != image-node bounds
// ---

/**
 * replace background-image url with data-url
 */
internal.pledge.urlAsUrn = ({ url }): Promise<void> => {
  return new Promise((resolve) => {
    const rasterImg = new Image();

    rasterImg.onload = async () => {
      // + image to canvas
      const raster = renderRaster.blank({
        wid: rasterImg.width,
        hei: rasterImg.height,
        typ: 'node',
      });
      raster.ctx.drawImage(rasterImg, 0, 0, rasterImg.width, rasterImg.height);

      // + resolve pledge
      resolve(raster.can.toDataURL('image/png'));
    };

    rasterImg.onerror = (err) => {
      // + resolve pledge
      resolve();
    };

    rasterImg.src = url;
  });
};

export default { ...fragment };
