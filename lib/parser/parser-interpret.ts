const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**
 * determine applied bounds for the browsers scrollbar
 */
internal.translateScroll = () => {
  // + return; if allready determine for current dpr
  if ('scroll' in internal && internal.scroll.dpr == globalThis.devicePixelRatio) return;

  const scrollNode = document.createElement('div');

  scrollNode.style.height = '100px';
  scrollNode.style.width = '100px';
  scrollNode.style.overflow = 'scroll scroll';
  // scrollNode.style.position = 'fixed';
  // scrollNode.style.inset = '-100px -100px';

  document.body.appendChild(scrollNode);

  internal.scroll = {
    dpr: globalThis.devicePixelRatio,
    hei: scrollNode.offsetWidth - scrollNode.scrollWidth,
    wid: scrollNode.offsetHeight - scrollNode.scrollHeight,
    // ? basically it's nothing more than creating a box and masseur its inner and
    //   outer bounds to get the offset created by the the scrollbar's bounds
  };

  document.body.removeChild(scrollNode);
};

// + update scrollbar bounds on dpr change
internal.translateScroll();
globalThis.addEventListener('resize', internal.translateScroll);

/**
 * determine applied properties and bounds
 */
fragment.applied = ({ target }) => {
  const ignore = !(target.node instanceof Element);

  // + determine node bounds
  const clientRect = ignore ? {} : target.node.getBoundingClientRect();
  const bounds = {
    x: clientRect.x, //
    y: clientRect.y,
    // ---
    // FIXME: ClientRect width and height are ceiled to the next heiger pixel value,
    //        resulting in incorrect element alignment on certain subpixel values
    wid: target.node.offsetWidth || 0, // clientRect.width || 0,
    hei: target.node.offsetHeight || 0, // clientRect.height || 0,
    // ---
  };

  // + determine scrollbar bounds
  const scroll = {
    x: target.node.scrollLeft,
    y: target.node.scrollTop,
    hei: internal.scroll.hei,
    wid: internal.scroll.wid,
  };

  // + determine applied offset from scroll position
  const offset = ignore //
    ? [0, 0, 0, 0]
    : [
        Math.min(0, 0 - scroll.y), //
        Math.min(0, 0 - (target.node.scrollWidth - scroll.x - target.node.offsetWidth)),
        Math.min(0, 0 - (target.node.scrollHeight - scroll.y - target.node.offsetHeight)),
        Math.min(0, 0 - scroll.x),
      ];

  // + determine applied styles
  const styles = ignore ? {} : globalThis.getComputedStyle(target.node);

  return { offset, styles, bounds, scroll };
};

/**
 * determine whether or not an node is rendered
 */
fragment.visible = ({ target }) => {
  // + nodes that are not rendered
  const nodeName = target.node.nodeName.toLowerCase();
  if (['#comment', 'style', 'script'].indexOf(nodeName) != -1) return false;

  // + nodes that are not linked with a parent
  if ('offsetParent' in target.node && target.node.offsetParent == null) false;

  // + hidden by style properties
  const { styles } = fragment.applied({ target });
  if (styles && styles.display == 'none') return false;

  // + visible
  return true;
};

/**
 * match element type
 */
fragment.hastype = ({ target, typ }) => {
  return [...typ].indexOf(target.node.nodeName.toLowerCase()) != -1;
};

export default { ...fragment };
