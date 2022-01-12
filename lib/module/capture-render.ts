const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/**/

fragment.render = async (captureHTML, config) => {
  const captureImage = await internal.parseAsSVG(captureHTML, config);
  const capturePaint = await internal.parseAsPNG(captureImage, config);

  return { blob: capturePaint };
};

/**/

internal.parseAsSVG = (captureHTML, config) => {
  return new Promise(async (resolve) => {
    const image = new Image();
    const plain = `<svg xmlns="http://www.w3.org/2000/svg" 
      width="${config.target.scrollWidth}" 
      height="${config.target.scrollHeight}">
      <foreignObject width="100%" height="100%">${captureHTML}</foreignObject>
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
    const result =
      config.resize <= 1
        ? canvas.can.convertToBlob()
        : internal
            .scaleCanvas({ canvas: canvas, resize: config.resize }) //
            .can.convertToBlob();

    resolve(result);
  });
};

/**/

internal.blankCanvas = ({ wid, hei }) => {
  console.log({ hei, wid });
  const can = new globalThis.OffscreenCanvas(wid, hei);
  const ctx = can.getContext('2d');
  return { can, ctx, wid, hei };
};

/**/

internal.scaleCanvas = ({ canvas, resize }: { canvas: any; resize: number }) => {
  const target = internal.blankCanvas({
    wid: canvas.wid * Math.ceil(resize), //
    hei: canvas.hei * Math.ceil(resize),
  });

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

export default fragment;
