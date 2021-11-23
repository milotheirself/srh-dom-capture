const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

self.onmessage = async (evt) => {
  const config = evt.data.config;
  const capture = evt.data.capture;

  const canvas = [new OffscreenCanvas(capture.width, capture.height)];

  const image = canvas[0] //
    .getContext('2d')
    .createImageData(capture.width, capture.height);

  image.data.set(capture.data);
  canvas[0] //
    .getContext('2d')
    .putImageData(image, 0, 0);

  if (config.result >= config.resize) {
    const captureBlob = await canvas[0].convertToBlob();

    self.postMessage({
      captureBlob: captureBlob,
    });
  } else {
    canvas[1] = new OffscreenCanvas(10, 10);
    canvas[1].width = canvas[0].width * Math.round(config.resize);
    canvas[1].height = canvas[0].height * Math.round(config.resize);

    internal.scaleToSize([canvas[0], canvas[1]], config.resize);

    const captureBlob = await canvas[1].convertToBlob();

    self.postMessage({
      captureBlob: captureBlob,
    });
  }
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
    for (let colourIndex = 0; colourIndex < 4; colourIndex++) {
      colour += decToHex(s[i + colourIndex]);
    }

    context.fillStyle = colour;

    let index = i / 4;
    let x = index % canvas[0].width;

    let y = ~~(index / canvas[0].width);

    context.fillRect(x * scale, y * scale, scale, scale);
  }
};
