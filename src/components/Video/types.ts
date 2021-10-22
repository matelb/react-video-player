export type VideoQuality =
  | "360p"
  | "480p"
  | "640p"
  | "720p"
  | "1080p"
  | "1280p"
  | "1440p"
  | "2k"
  | "4k"
  | "8k";

export enum VideoQualityEnum {
  "360p",
  "480p",
  "640p",
  "720p",
  "1080p",
  "1280p",
  "1440p",
  "2k",
  "4k",
  "8k",
}
type VideoType = "video/mp4" | "video/ogg" | "video/webm" | "video/3gp";
export type Preload = "metadata" | "auto" | "none";

export interface Time {
  hours: string;
  minutes: string;
  seconds: string;
}
export interface VideoTags {
  time: Time;
  tag: string;
}
export interface VideoList {
  src: string;
  quality?: VideoQuality;
  type?: VideoType;
}

interface VideoEvents {
  onEnd?: () => void;
  onMuted?: (muted: boolean) => void;
  onToggle?: () => void;
  /**
   * From 0 to 1
   */
  onUpdateVolume?: (volume: number) => void;
  /**
   * Raise when handle fullScreen
   */
  onFullScreen?: (isInFullScreen: boolean) => void;
  onQualityChange?: (quality: VideoQuality) => void;
  /**
   * Raise when pip is enabled in browser
   */
  onTogglePip?: (inPipMode: boolean) => void;
  onTogglePlay?: (play: boolean) => void;
}

interface ColorProps {
  buttonsColor?: string;
  volumeColor?: {
    background?: string;
    thumb?: string;
    bar?: string;
    container?: string;
  };
  progressColor?: {
    background?: string;
    thumb?: string;
    bar?: string;
    buffered?: string;
    text?: string;
  };
  qualitySelectorColor?: {
    background?: string;
    textColor?: {
      primary: string;
      selected: string;
    };
    borderColor?: string;
    hover?: {
      background?: string;
      color?: string;
    };
  };
  time?: {
    color: string;
  };
}

export interface VideoProps extends VideoEvents, ColorProps {
  videos: VideoList[];
  loop?: boolean;
  autoPlay?: boolean;
  poster?: string;
  playsInline?: boolean;
  preload?: Preload;
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  controls?: boolean;
  muted?: boolean;
  tags?: VideoTags[];
  defaultVideoQuality?: VideoQuality;
}
