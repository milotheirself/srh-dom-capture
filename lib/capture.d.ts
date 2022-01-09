export namespace CaptureInterface {
  /* */

  /**
   *
   */
  export interface Struct {
    preview: (params?: Params) => Result;
    capture: (params?: Params) => Result;
  }

  /**
   *
   */
  export interface Result {
    parsed: { [prop: string]: any };
    raster: null | { hei: number; wid: number; result: Uint8ClampedArray };
    vector: null | { hei: number; wid: number; result: HTMLImageElement };
  }

  /* */

  /**
   *
   */
  export type Params = {
    target?: any;
    option?: Option;
    render?: { [prop: string]: any }[];
  };

  /* */

  /**
   *
   */
  export type Option = {
    inset?: string;

    match?: () => void;
    apply?: () => void;

    capture?: {
      scale?: number;
    };

    resolve?: {
      scale?: number;
    };
  };
}
