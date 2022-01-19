import { default as captureCanvas } from './capture-canvas';

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
  return new Promise(async (resolve) => {
    const canvas = captureCanvas.blank({
      wid: Math.round(image.width * config.result), //
      hei: Math.round(image.height * config.result),
    });

    // + paint
    canvas.ctx.drawImage(image, 0, 0, canvas.can.width, canvas.can.height);

    resolve(
      config.resize <= 1
        ? // + resolve
          canvas.can.convertToBlob()
        : // + resize and resolve
          (
            await (() => {
              const target = captureCanvas.blank({
                wid: canvas.wid * Math.ceil(config.resize), //
                hei: canvas.hei * Math.ceil(config.resize),
              });

              return captureCanvas.scale({ target, canvas, resize: config.resize });
            })()
          ).can.convertToBlob()
    );
  });
};

export default { ...fragment };
