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

// /**/

// captureCanvas.blank = ({ wid, hei }) => {
//   const can = new globalThis.OffscreenCanvas(wid, hei);
//   const ctx = can.getContext('2d');
//   return { can, ctx, wid, hei };
// };
// internal.pixelCanvas = ({ canvas }) => {
//   return canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei);
// };

// /**/

// internal.scaleCanvas = ({ target, canvas, resize }) => {
//   const tar = target.ctx.getImageData(0, 0, target.wid, target.hei);
//   const val = canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei);

//   // + pre calc
//   let tarWid_4 = target.wid * 4;
//   let tarWid_4_res = tarWid_4 * resize;
//   let valWid_4 = canvas.wid * 4;
//   let resize_4 = resize * 4;

//   // + index pixel values
//   for (let y = 0; y <= canvas.hei; y++) {
//     let iVal_y = y * valWid_4;
//     let iTar_y = y * tarWid_4_res;

//     for (let x = 0; x <= valWid_4; x += 4) {
//       let iVal_yx = iVal_y + x;
//       let iTar_yx = iTar_y + x * resize;

//       // + fill the square
//       for (let m = 0; m < resize; m++) {
//         let iSqu_m = m * tarWid_4;

//         for (let n = 0; n < resize_4; n += 4) {
//           let iSqu_mn = iSqu_m + iTar_yx + n;

//           tar.data[iSqu_mn] = val.data[iVal_yx];
//           tar.data[iSqu_mn + 1] = val.data[iVal_yx + 1];
//           tar.data[iSqu_mn + 2] = val.data[iVal_yx + 2];
//           tar.data[iSqu_mn + 3] = val.data[iVal_yx + 3];
//         }
//       }
//     }
//   }

//   // +
//   target.ctx.putImageData(tar, 0, 0);
//   return target;
// };

// internal.scaleCanvasWorker = ({ target, canvas, resize }) => {
//   // return internal.scaleCanvas({ canvas, resize });

//   return new Promise((resolve) => {
//     const blobPlain = `
//       // + clone functions
//       const internal = {};
//       captureCanvas.blank = ${captureCanvas.blank.toString()}
//       internal.scaleCanvas = ${internal.scaleCanvas.toString()}

//       // +
//       globalThis.onmessage = ((event) => {
//         // +
//         const canvas = captureCanvas.blank({
//           wid: event.data.pixels.width,
//           hei: event.data.pixels.height
//         });

//         // +
//         const resize = event.data.resize;
//         const target = captureCanvas.blank({
//           wid: canvas.wid * resize, //
//           hei: canvas.hei * resize,
//         });

//         // +
//         canvas.ctx.putImageData(event.data.pixels, 0, 0);
//         globalThis.postMessage({
//           pixels: internal
//             .scaleCanvas({target, canvas, resize})
//             .ctx.getImageData(0, 0, target.wid, target.hei)
//         });
//       });

//       // +
//       self.postMessage({ });
//     `;
//     const blobURL = URL.createObjectURL(new Blob([blobPlain]));

//     // + init worker
//     const worker = new Worker(blobURL);
//     URL.revokeObjectURL(blobURL);

//     // + call worker
//     worker.onmessage = (event) => {
//       if ('pixels' in event.data) {
//         target.ctx.putImageData(event.data.pixels, 0, 0);
//         return resolve(target);
//       }

//       worker.postMessage({
//         pixels: canvas.ctx.getImageData(0, 0, canvas.wid, canvas.hei),
//         resize,
//       });
//     };
//   });
// };

export default fragment;
