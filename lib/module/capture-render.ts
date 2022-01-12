const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

fragment.render = async (captureNodes, config) => {
  const captureImage = await internal.parseAsSVG(captureNodes, config);
  const capturePaint = await internal.parseAsPNG(captureImage, config);

  return { blob: capturePaint };
};

/**/

internal.parseAsSVG = (nodes, config) => {
  return new Promise(async (resolve) => {
    const image = new Image();
    const plain = `<svg xmlns="http://www.w3.org/2000/svg" 
      width="${config.target.scrollWidth}" 
      height="${config.target.scrollHeight}">
      <foreignObject width="100%" height="100%">${nodes}</foreignObject>
    </svg>`;

    image.src = `data:image/svg+xml,${encodeURIComponent(plain)}`;
    image.onload = () => {
      resolve(image);
    };
  });
};

/**/

internal.parseAsPNG = (image, config) => {
  return new Promise(async (resolve, dismiss) => {
    const canvas = internal.blankCanvas({
      wid: Math.round(image.width * config.result), //
      hei: Math.round(image.height * config.result),
    });

    // + paint
    canvas.ctx.drawImage(image, 0, 0, canvas.can.width, canvas.can.height);

    // + resolve
    const resize =
      config.resize <= 1
        ? ({ canvas }) => canvas // + non-scaled
        : 'Worker' in globalThis // + scaled
        ? internal.scaleCanvasWorker
        : internal.scaleCanvas;

    const target = internal.blankCanvas({
      wid: canvas.wid * Math.ceil(config.resize), //
      hei: canvas.hei * Math.ceil(config.resize),
    });

    resolve((await resize({ target, canvas, resize: config.resize })).can.convertToBlob());
  });
};

/**/

internal.blankCanvas = ({ wid, hei }) => {
  const can = new globalThis.OffscreenCanvas(wid, hei);
  const ctx = can.getContext('2d');
  return { can, ctx, wid, hei };
};

/**/

internal.scaleCanvas = ({ target, canvas, resize }) => {
  // +
  const tar = target.ctx.getImageData(0, 0, target.wid, target.hei);
  const val = canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei);

  // +
  for (let i = 0; i <= val.data.length; i += 4) {
    // + pixel values
    let c = [val.data[i + 0], val.data[i + 1], val.data[i + 2], val.data[i + 3]];

    // + relative position
    let x = (i / 4) % canvas.wid;
    let y = Math.floor(i / 4 / canvas.wid) - 1;

    // + 0,0 index of target pixel values
    let j =
      y * 4 * target.wid * resize + //
      x * 4 * resize;

    // +
    for (let x_ = 0; x_ < resize; x_++) {
      for (let y_ = 0; y_ < resize; y_++) {
        let j_ =
          j + //
          x_ * 4 +
          y_ * 4 * target.wid;

        tar.data[j_ + 0] = c[0];
        tar.data[j_ + 1] = c[1];
        tar.data[j_ + 2] = c[2];
        tar.data[j_ + 3] = c[3];
      }
    }
  }

  // +
  target.ctx.putImageData(tar, 0, 0);
  return target;
};

internal.scaleCanvasWorker = ({ target, canvas, resize }) => {
  // return internal.scaleCanvas({ canvas, resize });

  return new Promise((resolve) => {
    const blobPlain = `
      // + clone functions
      const internal = {};
      internal.blankCanvas = ${internal.blankCanvas.toString()}
      internal.scaleCanvas = ${internal.scaleCanvas.toString()}

      // + 
      globalThis.onmessage = ((event) => {
        // +
        const canvas = internal.blankCanvas({
          wid: event.data.pixels.width,
          hei: event.data.pixels.height
        });
        
        // +
        const resize = event.data.resize;
        const target = internal.blankCanvas({
          wid: canvas.wid * resize, //
          hei: canvas.hei * resize,
        });
        
        // +
        canvas.ctx.putImageData(event.data.pixels, 0, 0);
        globalThis.postMessage({ 
          pixels: internal
            .scaleCanvas({target, canvas, resize})
            .ctx.getImageData(0, 0, target.wid, target.hei) 
        });
      });

      // + 
      self.postMessage({ });
    `;
    const blobURL = URL.createObjectURL(new Blob([blobPlain]));

    // + init worker
    const worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);

    // + call worker
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

export default fragment;
