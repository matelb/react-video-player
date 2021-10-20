export type VideoQuality =
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "2k"
  | "4K"
  | "8k";
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
