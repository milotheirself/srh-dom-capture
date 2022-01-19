/**
 * [...]
 */
export interface CaptureParams {
  /**
   * [...]
   */
  target?: any;

  /**
   * [...]
   */
  option?: CaptureOption;

  /**
   * [...]
   */
  render?: CaptureRender | CaptureRender[];
}

export type CaptureOptionDPR = number;

export type CaptureOption = {
  capture?: { dpr?: CaptureOptionDPR; inset?: string; background?: string };
  resolve?: { dpr?: CaptureOptionDPR };
};

export type CaptureRender = {
  [prop: string]: any;
};
