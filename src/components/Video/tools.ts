// formatTime takes a time length in seconds and returns the time in

import { VolumeLevel } from "./components/VideoControls/components/Controls/components/Volume/Volume";
import { Time, VideoList, VideoQuality, VideoQualityEnum } from "./types";
import _ from "lodash";

export function getVideos(
  videos: VideoList[],
  quality?: VideoQuality
): VideoList[] {
  if (!quality) return videos;

  const defaultVideos = videos.filter((v) => v.quality === quality);
  if (defaultVideos.length > 0) return defaultVideos;
  const qualities = getVideoQualities(videos).map(
    //(q) => q as unknown as VideoQualityEnum
    (q) => VideoQualityEnum[q]
  );

  if (qualities.length === 0) return videos;

  const lowQuality = _.orderBy(qualities, undefined, "asc")[0];

  const lowVideos = videos.filter(
    (v) => VideoQualityEnum[v.quality as VideoQuality] === lowQuality
  );

  if (lowVideos.length > 0) return lowVideos;

  return videos;
}

export function getQualityVideosSorted(
  quality: VideoQuality[]
): VideoQuality[] {
  const qualities = quality.map(
    //(q) => q as unknown as VideoQualityEnum
    (q) => VideoQualityEnum[q]
  );
  return _.orderBy(qualities, undefined, "asc").map(
    (q) => VideoQualityEnum[q] as VideoQuality
  );
}

// minutes and seconds and hours
export function formatTime(timeInSeconds: number): Time {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
  const hours = result.substr(0, 2);
  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
    hours:
      hours.length === 2 && hours.startsWith("0") ? hours.substr(1, 1) : hours,
  };
}

export function getPercentageOfTotal(totalTimeInSeconds: number, time: Time) {
  const totalTime = new Date(totalTimeInSeconds).getTime();
  const timeFormated = new Date(
    Number(time.hours) * 3600 + Number(time.minutes) * 60 + Number(time.seconds)
  ).getTime();
  return (timeFormated * 100) / totalTime;
}

export function getVolumeLevel(
  muted: boolean | undefined,
  volume: number | undefined
): VolumeLevel {
  if (muted === undefined) return "muted";
  if (volume === undefined) return "muted";

  if (muted || volume === 0) {
    return "muted";
  } else if (volume > 0 && volume <= 0.5) {
    return "low";
  } else {
    return "high";
  }
}

export function defaultCursor(
  videoRef: React.RefObject<HTMLVideoElement | HTMLDivElement>
) {
  const video = videoRef.current;
  if (video) {
    video.removeAttribute("style");
    //video.style.removeProperty("cursor");
  }
}

export function removeCursor(
  videoRef: React.RefObject<HTMLVideoElement | HTMLDivElement>
) {
  const video = videoRef.current;
  if (video) {
    video.style.cursor = "none";
  }
}

export function getVideoQualities(videos: VideoList[]): VideoQuality[] {
  const list: VideoQuality[] = [];
  videos.map((v) => {
    if (v.quality) list.push(v.quality);
  });

  return list;
}
