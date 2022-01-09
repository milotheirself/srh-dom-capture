import { default as renderVector } from './render-vector';
import { default as renderRaster } from './render-raster';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* interface */

fragment.render = ({ parsed, option }) => {
  const vector = internal.parseAsVector({ parsed });
  const raster = internal.parseAsRaster({ vector, option });

  return { parsed, raster, vector };
};

/* dom to vector */

internal.parseAsVector = ({ parsed }) => {
  return new Promise(async (resolve) => {
    const vector = new Image();

    vector.onload = () => {
      vector.onload = null;

      resolve({
        wid: vector.width,
        hei: vector.height,
        vec: vector,
      });
    };

    // + await for
    await Promise.all(parsed.pledge);

    // + serializ the dom replica to an readable html string
    const result = await parsed.result;
    const resultObject = new globalThis.XMLSerializer() //
      // ? XMLSerializer: https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
      // ? XMLSerializer.serializeToString: https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer/serializeToString
      .serializeToString(result.node);

    // + embed the html string as a svg  foreignObject
    vector.src = renderVector.svgData({
      // ? encodeURIComponent: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
      svg: globalThis.encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" 
        width="${parsed.bounds.wid}" 
        height="${parsed.bounds.hei}">
        <foreignObject width="100%" height="100%">${resultObject}</foreignObject>
      </svg>`),
    });
  });
};

/* vector to raster */

internal.parseAsRaster = ({ vector, option }) => {
  return new Promise(async (resolve) => {
    const resultVector = await vector;
    const raster = renderRaster.blank({
      wid: Math.round(resultVector.wid * option.capture.scale), //
      hei: Math.round(resultVector.hei * option.capture.scale),
    });

    raster.ctx.drawImage(
      ...[resultVector.vec, 0, 0], //
      ...[resultVector.wid * option.capture.scale, resultVector.hei * option.capture.scale]
      // ? to draw the vector, we must use unrounded values, as they can influence
      //   subpixel placement even with the bounds of all nested elements being static
    );

    const result =
      option.resolve.scale <= 1
        ? // + resolve
          raster
        : // + resize and resolve
          await (() => {
            const target = renderRaster.blank({
              wid: raster.wid * Math.ceil(option.resolve.scale), //
              hei: raster.hei * Math.ceil(option.resolve.scale),
            });

            return renderRaster.scale({ target, canvas: raster, resize: option.resolve.scale });
          })();

    resolve({
      wid: result.wid,
      hei: result.hei,
      result: result.ctx.getImageData(0, 0, result.wid, result.hei).data as Uint8ClampedArray,
    });
  });
};

export default { ...fragment };
