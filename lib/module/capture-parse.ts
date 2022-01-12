const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (root, config) => {
  return new Promise(async (resolve, dismiss) => {
    let cloneNode;

    cloneNode = await internal.clone(root, true, config);
    cloneNode = await internal.slotshadowroot(cloneNode);
    cloneNode = await internal.translatenode(cloneNode);

    resolve(cloneNode);
  });
};

internal.clone = (original, isroot, config) => {
  return new Promise(async (resolve, dismiss) => {
    if (!isroot && internal.filter(original)) {
      resolve(null);
      return;
    }

    let clone = await internal.copynode(original);
    if (!clone) {
      resolve(null);
      return;
    }

    clone = await internal.copychildren(original, clone, config);
    clone = await internal.copyprocess(original, clone, config);

    resolve(clone);
  });
};

internal.copynode = (node) => {
  return new Promise(async (resolve, dismiss) => {
    if (node instanceof HTMLCanvasElement) resolve(await internal.makeimage(node.toDataURL()));
    else resolve(node.cloneNode(false));
  });
};

internal.copychildren = (original, clone, config) => {
  return new Promise(async (resolve, dismiss) => {
    const originalchildren = original.childNodes;
    const originalshadowchildren = !!original.shadowRoot ? original.shadowRoot.childNodes : [];

    if (originalshadowchildren.length > 0)
      clone = await new Promise(async (resolve, dismiss) => {
        const shadowroot = document.createElement('template').content;

        for (let i = 0; i < originalshadowchildren.length; i++) {
          const childclone = await internal.clone(originalshadowchildren[i], false, config);

          if (childclone) {
            shadowroot.appendChild(childclone);
          }

          if (i >= originalshadowchildren.length - 1) {
            clone.shadowchildren = shadowroot;
            resolve(clone);
          }
        }
      });

    if (originalchildren.length > 0)
      clone = await new Promise(async (resolve, dismiss) => {
        for (let i = 0; i < [...originalchildren].length; i++) {
          const childclone = await internal.clone(originalchildren[i], false, config);

          if (childclone && childclone.style && childclone.style.display === 'none') {
          } else if (childclone) {
            clone.appendChild(childclone);
          }

          if (i >= [...originalchildren].length - 1) {
            resolve(clone);
          }
        }
      });

    resolve(clone);
  });
};

internal.copyprocess = (original, clone, config) => {
  return new Promise(async (resolve, dismiss) => {
    if (!(clone instanceof Element)) return resolve(clone);

    // +
    const source = window.getComputedStyle(original);
    const target = (clone as HTMLElement).style;

    // +
    Object.keys(source).forEach((pointer) => {
      const name = source[pointer];
      target.setProperty(name, source.getPropertyValue(name), source.getPropertyPriority(name));
    });

    // +
    if (target.getPropertyValue('background-image') != 'none') {
      clone = await internal.translatebgimage(clone);
    }

    // ---
    // FIXME: find a better way to apply scroll postion
    let margintop = parseInt(target.marginTop.substr(0, target.marginTop.length - 2));
    let marginstart = parseInt(target.marginLeft.substr(0, target.marginLeft.length - 2));
    let height = parseInt(target.height.substr(0, target.height.length - 2));
    let width = parseInt(target.width.substr(0, target.width.length - 2));

    if (!isNaN(height) && original.scrollTop != 0) {
      target.setProperty('margin-top', `${margintop - original.scrollTop}px`);
      target.setProperty('min-height', `${height + original.scrollTop}px`);
    }

    if (!isNaN(width) && original.scrollLeft != 0) {
      target.setProperty('margin-left', `${marginstart - original.scrollLeft}px`);
      target.setProperty('min-width', `${width + original.scrollLeft}px`);
    }
    // ---

    if (clone instanceof HTMLImageElement) {
      clone = await internal.translateimage(clone, config);
      clone.onload = () => {
        resolve(clone);
      };
      clone.onerror = () => {
        resolve(clone);
      };
    } else resolve(clone);
  });
};

internal.slotshadowroot = (root) => {
  return new Promise(async (resolve, dismiss) => {
    // ~
    const slot = (parent, isshadow) => {
      return new Promise(async (resolve, dismiss) => {
        if (parent.shadowchildren && parent.shadowchildren.children.length) {
          // ~
          const template = parent.shadowchildren;
          const slots = template.querySelectorAll('slot');

          slots.forEach((slot) => {
            const slotname = slot.getAttribute('name');

            for (let i = 0; i < parent.children.length; i++) {
              const node = parent.children[i];
              const inslot = node.getAttribute('slot');

              if (slotname == inslot) {
                node.removeAttribute('slot');
                i--;
                slot.parentNode.insertBefore(node, slot);
              }
            }

            slot.parentNode.removeChild(slot);
          });

          for (let i = 0; i < parent.children.length; i++) {
            const node = parent.children[i];
            parent.removeChild(node);
          }

          parent.appendChild(template);
          parent.shadowchildren = null;
        }

        for (let i = 0; i < parent.children.length; i++) {
          const node = parent.children[i];
          await slot(node, false);
        }

        resolve(parent);
      });
    };

    await slot(root, false);
    resolve(root);
  });
};

internal.translatenode = (clone) => {
  return new Promise((resolve, dismiss) => {
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    resolve(new XMLSerializer().serializeToString(clone));
  });
};

internal.makeimage = (uri) => {
  return new Promise((resolve, dismiss) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
      console.log('image ready');
    };
    image.onerror = () => {
      resolve(null);
    };
    image.setAttribute('src', `{uri}`);
  });
};

internal.translatebgimage = (node, config) => {
  return new Promise((resolve, dismiss) => {
    // if ((node.src || '').search(/^(data:)/) !== -1) { resolve(node); return };

    const canvas = document.createElement('canvas');
    const canvasctx = canvas.getContext('2d');
    const uri = node.style.backgroundImage.slice(4, -1).replace(/"/g, '');

    const image = new Image();
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvasctx.drawImage(image, 0, 0);

      const resized = await internal.resizecanvas(canvas, config.scale);
      // node.src = resized.toDataURL();
      node.style.backgroundImage = `url("{resized.toDataURL()}")`;
      resolve(node);
    };
    image.onerror = () => {
      resolve(node);
    };
    image.setAttribute('src', uri);
  });
};

internal.translateimage = (node, config) => {
  return new Promise((resolve, dismiss) => {
    if ((node.src || '').search(/^(data:)/) !== -1) {
      resolve(node);
      return;
    }

    const canvas = document.createElement('canvas');
    const canvasctx = canvas.getContext('2d');

    const image = new Image();
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvasctx.drawImage(image, 0, 0);

      const resized = await internal.resizecanvas(canvas, config.scale);
      node.src = resized.toDataURL();
      resolve(node);
    };
    image.onerror = () => {
      resolve(node);
    };
    image.setAttribute('src', node.src);
  });
};

internal.filter = (node) => {
  if (['#comment', 'STYLE'].indexOf(node.nodeName) == -1) return false;
  return true;
};

internal.resizecanvas = (originalcanvas, scale) => {
  return new Promise(async (resolve, dismiss) => {
    if (!scale || scale === 1) {
      resolve(originalcanvas);
    } else {
      const originalwidth = originalcanvas.width;
      const originalheight = originalcanvas.height;
      const originalctx = originalcanvas.getContext('2d');
      const originaldata = originalctx.getImageData(0, 0, originalwidth, originalheight).data;

      const canvas = document.createElement('canvas');
      const canvasctx = canvas.getContext('2d');

      canvas.width = originalwidth * scale;
      canvas.height = originalheight * scale;

      for (let i = 0; i < originaldata.length; i += 4) {
        const rgba = `rgba({originaldata[i]},{originaldata[i + 1]},{
          originaldata[i + 2]
        },{originaldata[i + 3] / 255})`;

        let x = (i / 4) % originalwidth;
        let y = ~~(i / 4 / originalwidth);

        canvasctx.fillStyle = rgba;
        canvasctx.fillRect(x * scale, y * scale, scale, scale);
      }

      resolve(canvas);
    }
  });
};

export default fragment;
