import React, { useCallback, useEffect, useRef, useState } from "react";
import { VideoControls } from "./components";
import { PlayIcons } from "./components/VideoControls";
import Controls from "./components/VideoControls/components/Controls";
import {
  defaultCursor,
  formatTime,
  getVideoQualities,
  getVideos,
  getVolumeLevel,
  removeCursor,
} from "./tools";
import styled from "styled-components";
import {
  FullScreen,
  PIP,
  QualitySelect,
  VideoProgress,
  Volume,
} from "./components/VideoControls/components/Controls/components";
import { VolumeLevel } from "./components/VideoControls/components/Controls/components/Volume/Volume";
import { Duration } from "./components/VideoControls/components/Controls/components/TimeElapsed/types";
import {
  TimeElapsedControl,
  TotalTime,
} from "./components/VideoControls/components/Controls/components/TimeElapsed";
import { CONTROLSHIDETIME } from "./components/VideoControls/Utilities/Config";
import { Preload, VideoList, VideoQuality, VideoTags } from "./types";
import _ from "lodash";

interface VideoProps {
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
  tags?: VideoTags[];
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
  time?: {
    color: string;
  };
}

const Video = ({
  videos,
  loop,
  autoPlay,
  poster,
  playsInline,
  preload,
  className,
  width,
  height,
  rounded,
  controls,
  tags,
  volumeColor,
  buttonsColor,
  progressColor,
  time,
}: VideoProps) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [buffered, setBuffered] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [quality, setQuality] = useState<VideoQuality>("1080p");
  const [disabledPIP, setDisabledPIP] = useState<boolean>(false);
  const [mouseMoving, setMouseMoving] = useState<boolean>(false);
  const [videoMoving, setVideoMoving] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<VolumeLevel>();
  const [duration, setDuration] = useState<Duration>({
    seconds: "00",
    minutes: "00",
    hours: "0",
  });
  const [timeElapsed, setTimeElapsed] = useState<Duration>({
    seconds: "00",
    minutes: "00",
    hours: "0",
  });
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.controls = false;
      video.volume = 1;
      document.addEventListener("keyup", keyboardShortcuts);
      document.addEventListener("fullscreenchange", () => exitFullscreen());
    }
    return () => {
      document.removeEventListener("keyup", keyboardShortcuts);
      document.removeEventListener("fullscreenchange", () => exitFullscreen());
    };
  }, []);

  const exitFullscreen = () => {
    if (!document.fullscreenElement) {
      defaultCursor(videoRef);
      setFullScreen(false);
    }
  };

  const onMouseMove = (
    e: React.MouseEvent<HTMLVideoElement | HTMLDivElement, MouseEvent>
  ) => {
    // e.preventDefault();
    if (!fullScreen) {
      // setShowControls(true);
      defaultCursor(videoContainerRef);
      return;
    }
  };

  const setMouseVideoMove = useCallback(
    (e: React.MouseEvent<HTMLVideoElement | HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      defaultCursor(videoRef);
      if (!fullScreen) return;

      if (
        (window as any).prev_x != null &&
        (window as any).prev_x != e.clientX
      ) {
        setShowControls(true);
        defaultCursor(videoRef);
      }

      (window as any).prev_x = e.clientX;

      let timeout;
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(
          () => {
            if (fullScreen) {
              setShowControls(false);
              removeCursor(videoRef);
            }
          },
          CONTROLSHIDETIME,
          fullScreen
        );
      })();
    },
    [fullScreen]
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const initializeVideo = () => {
    const video = videoRef.current;
    if (video) {
      const videoDuration = Math.round(video.duration);
      setVideoDuration(videoDuration);
      const time = formatTime(videoDuration);
      setDuration(time);
    }
  };

  const updateTimeElapsed = () => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      if (currentTime > 0) {
        const time = formatTime(Math.round(video.currentTime));
        setTimeElapsed(time);
        const timeLeft = formatTime(
          Math.round(video.duration - video.currentTime)
        );
        setDuration(timeLeft);
      }
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (video) {
      setProgress(Math.floor(video.currentTime));
    }
  };

  const endVideo = () => {
    const video = videoRef.current;
    if (video) {
      setProgress(Math.round(video.duration));
      closeFullScreen();
    }
  };

  const updateVolume = (value: string) => {
    const video = videoRef.current;
    if (video) {
      if (video.muted) {
        video.muted = false;
      }
      const volume = Number(value) / 100;
      setVolumeLevel(getVolumeLevel(videoRef.current?.muted, volume));
      video.volume = volume;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const muted = !video.muted;
      setVolumeLevel(getVolumeLevel(muted, videoRef.current?.volume));
      video.muted = muted;
    }
  };

  const handleSkip = (value: number) => {
    const video = videoRef.current;
    if (video) {
      setProgress(value);
      video.currentTime = value;
    }
  };

  const toggleFullScreen = () => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        defaultCursor(videoRef);
        setFullScreen(false);
        // } else if ((document as any).webkitFullscreenElement) {
        //   //Need this to support Safari
        //   (document as any).webkitExitFullscreen();
        //   setFullScreen(false);
        // } else if ((videoContainer as any).webkitRequestFullscreen) {
        //   // Need this to support Safari
        //   (videoContainer as any).webkitRequestFullscreen();
        //   setFullScreen(true);
      } else {
        videoContainer.requestFullscreen();
        setFullScreen(true);
      }
    }
  };

  const closeFullScreen = () => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        defaultCursor(videoRef);
        setFullScreen(false);
      }
      //  else if ((document as any).webkitFullscreenElement) {
      //   //Need this to support Safari
      //   (document as any).webkitExitFullscreen();
      //   setFullScreen(false);
      //   defaultCursor();
      // }
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        if (video !== document.pictureInPictureElement) {
          setDisabledPIP(true);
          await video.requestPictureInPicture();
        } else {
          await document.exitPictureInPicture();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setDisabledPIP(false);
      }
    }
  };

  // keyboardShortcuts executes the relevant functions for
  // each supported shortcut key
  function keyboardShortcuts(event: KeyboardEvent) {
    const { key } = event;
    const video = videoRef.current;
    if (video) {
      console.log({ key });
      switch (key) {
        case "k":
          togglePlay();
          //animatePlayback();
          if (video.paused) {
            setShowControls(true);
          } else {
            setTimeout(() => {
              setShowControls(false);
            }, 2000);
          }
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullScreen();
          break;
        case "p":
          togglePip();
          break;
      }
    }
  }

  const onProgress = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.currentTarget;
    if (video) {
      var range = 0;
      var bf = video.buffered;
      var time = video.currentTime;
      if (bf.length > 0) {
        try {
          while (!(bf.start(range) <= time && time <= bf.end(range))) {
            range += 1;
          }
          var loadStartPercentage = bf.start(range) / video.duration;
          var loadEndPercentage = bf.end(range) / video.duration;
          var loadPercentage = loadEndPercentage - loadStartPercentage;
          setBuffered(loadPercentage);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const onQualityChange = (quality: VideoQuality) => {
    const video = videoRef.current;
    if (video) {
      setQuality(quality);
      video.load();
    }
  };

  const qualities = _.uniq(getVideoQualities(videos));

  return (
    <>
      <Container
        ref={videoContainerRef}
        width={width}
        height={height}
        className={className}
        rounded={rounded}
        onMouseMove={(event) => onMouseMove(event)}
      >
        <video
          ref={videoRef}
          controls
          autoPlay={autoPlay}
          id="video"
          playsInline={playsInline}
          preload={preload}
          poster={poster}
          loop={loop}
          onMouseMove={(event) => setMouseVideoMove(event)}
          onMouseEnter={() => {
            if (!fullScreen) {
              defaultCursor(videoRef);
              setShowControls(true);
            }
          }}
          onMouseLeave={() => {
            if (!fullScreen) {
              defaultCursor(videoRef);
              setShowControls(false);
            }
          }}
          onClick={() => setIsPlaying(!isPlaying)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={() => initializeVideo()}
          onEnded={() => endVideo()}
          onTimeUpdate={() => {
            updateTimeElapsed();
            updateProgress();
          }}
          onProgress={(v) => onProgress(v)}
        >
          {getVideos(videos, quality).map((video, i) => (
            <source src={video.src} type={video.type} key={i}></source>
          ))}
          Your browser does not support HTML5 video.
        </video>
        {controls ? (
          <VideoControls show={showControls} fullScreen={fullScreen}>
            <PlayIcons
              playing={isPlaying}
              togglePlay={() => togglePlay()}
              color={buttonsColor}
            />
            <Controls>
              <LeftControls>
                <Volume
                  onChange={updateVolume}
                  volumeLevel={volumeLevel}
                  onClick={toggleMute}
                  backgroundBarColor={volumeColor?.background}
                  barColor={volumeColor?.bar}
                  thumbColor={volumeColor?.thumb}
                  containerColor={volumeColor?.container}
                  buttonColor={buttonsColor}
                />
                <TimeElapsedControl
                  timeElapsed={timeElapsed}
                  color={time?.color}
                />
              </LeftControls>
              <VideoProgress
                max={videoDuration}
                progress={progress}
                onSkip={handleSkip}
                buffered={buffered}
                tags={tags}
                backgroundBarColor={progressColor?.background}
                barColor={progressColor?.bar}
                thumbColor={progressColor?.thumb}
                textColor={progressColor?.text}
                bufferedColor={progressColor?.buffered}
              />
              <RightControls>
                <TotalTime duration={duration} color={time?.color} />
                <PIP
                  togglePip={togglePip}
                  disabled={disabledPIP}
                  color={buttonsColor}
                />
                <FullScreen
                  toggleFullScreen={toggleFullScreen}
                  fullScreen={fullScreen}
                  color={buttonsColor}
                />
                {qualities && qualities.length > 1 ? (
                  <QualitySelect
                    value={quality}
                    qualities={qualities}
                    onChange={onQualityChange}
                  />
                ) : null}
              </RightControls>
            </Controls>
          </VideoControls>
        ) : null}
      </Container>
      <button type="button" onClick={() => setShowControls(!showControls)}>
        Hide
      </button>
      <input
        type="range"
        onChange={(value) => console.log({ range: value.target.value })}
      ></input>
      <span>Buffered {buffered}</span>
      <Container
        width={width}
        height={height}
        className={className}
        rounded={rounded}
      >
        <video autoPlay loop controls>
          <source
            src="http://edge-assets.wirewax.com/blog/vidData/example1080.webm"
            type="video/webm"
          />
        </video>
      </Container>
    </>
  );
};

export default Video;

interface VideoContainerProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

const Container = styled.div`
  width: ${(props: VideoContainerProps) => props.width || "auto"};
  height: ${(props: VideoContainerProps) => props.height || "auto"};
  border-radius: ${(props: VideoContainerProps) =>
    props.rounded ? "9px" : "none"};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const LeftControls = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 1rem;
  height: 1.3em;
`;
const RightControls = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 1rem;
  align-items: center;
  height: 1.3em;
`;
