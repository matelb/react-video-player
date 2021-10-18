import {
  BACKGROUND_COLORBASE,
  BUFFERED_COLOR,
  COLORBASE,
  GREEN,
  LIGHTGRAY,
  TURQUOUSE,
} from "./Color";

export const CONTROLSHIDETIME = 3000;
export const INITIALCONFIGURATION = {
  BUTTONCOLOR: COLORBASE,
  VolumeBar: {
    BACKGROUNDCOLOR: COLORBASE,
    VOLUMECOLOR: TURQUOUSE,
    CONTAINERCOLOR: LIGHTGRAY,
    THUMBCOLOR: GREEN,
  },
  ProgressBar: {
    BUFFEREDCOLOR: BUFFERED_COLOR,
    BACKGROUNDCOLOR: BACKGROUND_COLORBASE,
    PROGRESSCOLOR: TURQUOUSE,
    THUMBCOLOR: GREEN,
    TEXT: COLORBASE,
  },
  Time: {
    COLOR: COLORBASE,
  },
};
