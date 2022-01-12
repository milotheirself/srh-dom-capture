const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* utils */

fragment.blank = ({ wid, hei, typ }) => {
  const can =
    typ != 'node' && 'OffscreenCanvas' in globalThis
      ? new globalThis.OffscreenCanvas(10, 10) //
      : document.createElement('canvas');

  const ctx = can.getContext('2d');

  can.width = Math.round(wid);
  can.height = Math.round(hei);

  return { can, ctx, wid, hei };
};

fragment.pixel = ({ ctx }) => {
  return ctx.getImageData(0, 0, ctx.wid, ctx.hei);
};

/* scaling */

fragment.scale = ({ target, canvas, resize }) => {
  // + if web-worker are not supported; scale on the main thread
  if (!('Worker' in globalThis)) {
    return fragment.scaleNearestNeighbor({ canvas, resize });
  }

  // + scale in a web-worker
  return new Promise((resolve) => {
    // + create the script running from the worker
    // ? scaling still runs as fragment.scaleNearestNeighbor; this is basically
    //   just the communication interface to the worker
    const blobPlain = `
      const internal = {};
      internal.blank = ${fragment.blank.toString()}
      internal.scale = ${fragment.scaleNearestNeighbor.toString()}

      globalThis.onmessage = ((event) => {
        const canvas = internal.blank({
          wid: event.data.pixels.width,
          hei: event.data.pixels.height
        });

        const resize = event.data.resize;
        const target = internal.blank({
          wid: canvas.wid * resize,
          hei: canvas.hei * resize,
        });

        canvas.ctx.putImageData(event.data.pixels, 0, 0);
        globalThis.postMessage({
          pixels: internal
            .scale({target, canvas, resize})
            .ctx.getImageData(0, 0, target.wid, target.hei)
        });
      });

      self.postMessage({ });
    `;
    const blobURL = URL.createObjectURL(new Blob([blobPlain]));

    // + create a new worker
    const worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);

    // + start the worker thread
    worker.onmessage = (event) => {
      if ('pixels' in event.data) {
        target.ctx.putImageData(event.data.pixels, 0, 0);
        return resolve(target);
      }

      worker.postMessage({
        pixels: canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei),
        resize,
      });
    };
  });
};

fragment.scaleNearestNeighbor = ({ target, canvas, resize }) => {
  // ? the following is sacrificing some code readability; with larger upscales,
  //   this will be a massive array mapping running on the CPU, so it has be
  //   optimized at least a little...

  // + read out both current pixel arrays
  const tar = target.ctx.getImageData(0, 0, target.wid, target.hei);
  const val = canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei);

  // ? this is how it works:
  //
  //   resize := 2                               | if resize is 2: make 1 pixel
  //                                             | a 2 by 2 pixel square
  //
  //   tar := [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_]  | emty ImageData of a 4 by 4 image
  //   val := [a,b,c,d]                          | ImageData of a 2 by 2 image
  //
  //   tar := f([ a,b,c,d ]) -> [ a,a,b,b,a,a,b,b,c,c,d,d,c,c,d,d ]
  //
  //       := f([ a, b,      -> [ a, a, b, b,
  //              c, d ])         a, a, b, b,
  //                              c, c, d, d,
  //                              c, c, d, d ]

  // + calculate the common index offsets in advance
  let tarWid_4 = target.wid * 4;
  let tarWid_4_res = tarWid_4 * resize;
  let valWid_4 = canvas.wid * 4;
  let resize_4 = resize * 4;

  // + create reusable index offsets
  let iVal_y, iTar_y, iVal_yx, iTar_yx, iSqu_m, iSqu_mn;

  // + iterate through the reference canvases pixel values and target pixel positions
  for (let y = 0; y <= canvas.hei; y++) {
    iVal_y = y * valWid_4;
    iTar_y = y * tarWid_4_res;

    for (let x = 0; x <= valWid_4; x += 4) {
      // ?     := f([ a, b,      -> [ a, _, b, _,
      //              c, d ])         _, _, _, _,
      //                              c, _, d, _,
      //                              _, _, _, _ ]

      iVal_yx = iVal_y + x;
      iTar_yx = iTar_y + x * resize;

      // + fill the square in the target canvas
      for (let m = 0; m < resize; m++) {
        iSqu_m = m * tarWid_4;

        for (let n = 0; n < resize_4; n += 4) {
          // ?     := f([ a, b,      -> [ a, a, b, b,
          //              c, d ])         a, a, b, b,
          //                              c, c, d, d,
          //                              c, c, d, d ]

          iSqu_mn = iSqu_m + iTar_yx + n;

          tar.data[iSqu_mn] = val.data[iVal_yx];
          tar.data[iSqu_mn + 1] = val.data[iVal_yx + 1];
          tar.data[iSqu_mn + 2] = val.data[iVal_yx + 2];
          tar.data[iSqu_mn + 3] = val.data[iVal_yx + 3];
        }
      }
    }
  }

  // + update target canvas with its filled pixel data
  target.ctx.putImageData(tar, 0, 0);
  return target;
};

export default { ...fragment };
