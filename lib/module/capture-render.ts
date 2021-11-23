const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

// /** */
// fragment.worker = {};
// fragment.worker.render = (captureHTML, config) => {
//   return new Promise(async (resolve) => {
//     const captureUrn = internal.createSvgUrn(captureHTML, config);
//     const captureCanvas = await internal.createCanvas(captureUrn, config);
//     // const captureBlob = await internal.createPng(captureCanvas, config);

//     const worker = new Worker('/assets/@applic-module/applic-lit-capture/module/capture-render-worker.js');

//     const captureImage = captureCanvas.getContext('2d').getImageData(0, 0, captureCanvas.width, captureCanvas.height);

//     worker.postMessage({
//       config: {
//         result: config.result,
//         resize: config.resize,
//       },
//       capture: {
//         data: captureImage.data,
//         width: captureImage.width,
//         height: captureImage.height,
//       },
//     });

//     worker.onmessage = (evt) => {
//       const captureBlob = evt.data.captureBlob;

//       resolve({
//         blob: captureBlob,
//         blobUrn: URL.createObjectURL(captureBlob),
//       });
//     };
//   });
// };

/** */
fragment.render = (captureHTML, config) => {
  return new Promise(async (resolve) => {
    const captureUrn = internal.createSvgUrn(captureHTML, config);
    const captureCanvas = await internal.createCanvas(captureUrn, config);
    const captureBlob = await internal.createPng(captureCanvas, config);

    resolve({
      blob: captureBlob,
      blobUrn: URL.createObjectURL(captureBlob),
    });
  });
};

/** */
internal.createSvgUrn = (captureHTML, config) => {
  const svgNode = `
    <svg xmlns="http://www.w3.org/2000/svg" 
      width="${config.target.scrollWidth}" 
      height="${config.target.scrollHeight}">
      <foreignObject width="100%" height="100%">${captureHTML}</foreignObject>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svgNode)}`;
};

/** */
internal.createCanvas = (captureSvgUrn, config) => {
  return new Promise(async (resolve, dismiss) => {
    const image = new Image();

    image.onload = () => {
      const canvas = new globalThis.OffscreenCanvas(10, 10);

      canvas.width = Math.round(image.width * config.result);
      canvas.height = Math.round(image.height * config.result);

      canvas //
        .getContext('2d')
        .drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve(canvas);
      // resolve(image);
    };
    image.src = captureSvgUrn;
  });
};

/** */
internal.createPng = (captureSvg, config) => {
  return new Promise(async (resolve, dismiss) => {
    const canvas = [new globalThis.OffscreenCanvas(10, 10), new globalThis.OffscreenCanvas(10, 10)];

    canvas[0].width = Math.round(captureSvg.width * config.result);
    canvas[0].height = Math.round(captureSvg.height * config.result);

    canvas[0] //
      .getContext('2d')
      .drawImage(captureSvg, 0, 0, canvas[0].width, canvas[0].height);

    if (config.result >= config.resize) {
      resolve(canvas[0].convertToBlob());
    } else {
      internal.scaleToSize([...canvas], config.resize);
      resolve(canvas[1].convertToBlob());
    }

    delete canvas[0];
    delete canvas[1];
  });
};

/** */
internal.scaleToSize = (canvas, scale) => {
  canvas[1].width = canvas[0].width * Math.round(scale);
  canvas[1].height = canvas[0].height * Math.round(scale);

  const context = canvas[1].getContext('2d');
  const s = canvas[0].getContext('2d').getImageData(0, 0, canvas[0].width, canvas[0].height).data;
  const decToHex = (int) => {
    let out = int.toString(16);
    if (out.length < 2) {
      out = '0' + out;
    }
    return out;
  };

  context.imageSmoothingEnabled = false;

  for (let i = 0; i < s.length; i += 4) {
    let colour = '#';
    for (let colourIndex = 0; colourIndex < 3; colourIndex++) {
      colour += decToHex(s[i + colourIndex]);
    }

    context.fillStyle = colour;

    let index = i / 4;
    let x = index % canvas[0].width;

    let y = ~~(index / canvas[0].width);

    context.fillRect(x * scale, y * scale, scale, scale);
  }
};

export default fragment;
