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
import { VideoProps, VideoQuality } from "./types";
import _ from "lodash";

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
  muted,
  defaultVideoQuality,
  onEnd,
  onMuted,
  onUpdateVolume,
  onFullScreen,
  onQualityChange: onQualityChangeCallback,
  onTogglePip,
  onTogglePlay,
}: VideoProps) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [buffered, setBuffered] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [hoverControlsOnFullScreen, setHoverControlsOnFullScreen] =
    useState<boolean>(false);
  const [quality, setQuality] = useState<VideoQuality>(
    defaultVideoQuality || "720p"
  );
  const [disabledPIP, setDisabledPIP] = useState<boolean>(false);
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
      initialVolume();
      document.addEventListener("keyup", keyboardShortcuts);
      document.addEventListener("fullscreenchange", () => exitFullScreen());
    }
    return () => {
      document.removeEventListener("keyup", keyboardShortcuts);
      document.removeEventListener("fullscreenchange", () => exitFullScreen());
    };
  }, []);

  const initialVolume = () => {
    const video = videoRef.current;
    if (video) {
      if (muted) {
        video.volume = 0;
        setVolumeLevel("muted");
      } else {
        video.volume = 1;
        setVolumeLevel("high");
      }
    }
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLVideoElement | HTMLDivElement, MouseEvent>) => {
      if (!fullScreen) {
        defaultCursor(videoContainerRef);
        return;
      }
    },
    []
  );

  const setMouseVideoMove = useCallback(
    (e: React.MouseEvent<HTMLVideoElement | HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      defaultCursor(videoRef);
      if (!fullScreen) return;

      if (
        (window as any).prev_x != null &&
        (window as any).prev_x != e.clientX &&
        (window as any).prev_y != e.clientY
      ) {
        setShowControls(true);
        defaultCursor(videoRef);
      }

      (window as any).prev_x = e.clientX;
      (window as any).prev_y = e.clientY;

      let timeout;
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(
          () => {
            if (
              (window as any).prev_x === e.clientX &&
              (window as any).prev_y === e.clientY
            ) {
              if (fullScreen) {
                setShowControls(false);
                removeCursor(videoRef);
              }
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
        if (onTogglePlay) onTogglePlay(true);
      } else {
        video.pause();
        if (onTogglePlay) onTogglePlay(false);
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
      const duration = video.duration;
      if (currentTime > 0 && duration > 0) {
        const time = formatTime(Math.round(currentTime));
        setTimeElapsed(time);
        const timeLeft = formatTime(Math.round(duration - currentTime));
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
      defaultCursor(videoRef);
      setFullScreen(false);
      setHoverControlsOnFullScreen(false);
      if (document && document.fullscreenElement) {
        document.exitFullscreen();
      }
      if (onEnd) onEnd();
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
      if (onUpdateVolume) onUpdateVolume(volume);
      if (volume === 0 && onMuted) onMuted(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const muted = !video.muted;
      setVolumeLevel(getVolumeLevel(muted, videoRef.current?.volume));
      video.muted = muted;
      if (onMuted) onMuted(muted);
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
        setHoverControlsOnFullScreen(false);
        if (onFullScreen) onFullScreen(false);
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
        if (onFullScreen) onFullScreen(true);
      }
    }
  };

  const exitFullScreen = () => {
    if (document && !document.fullscreenElement) {
      defaultCursor(videoRef);
      setFullScreen(false);
      setHoverControlsOnFullScreen(false);
      if (onFullScreen) onFullScreen(false);
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        if (video !== document.pictureInPictureElement) {
          setDisabledPIP(true);
          await video.requestPictureInPicture();
          if (onTogglePip) onTogglePip(true);
        } else {
          await document.exitPictureInPicture();
          if (onTogglePip) onTogglePip(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setDisabledPIP(false);
      }
    }
  };

  function keyboardShortcuts(event: KeyboardEvent) {
    const { key } = event;
    const video = videoRef.current;
    if (video) {
      console.log({ key });
      switch (key) {
        case "k":
          togglePlay();
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

  const onBufferProgress = (
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
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
      if (onQualityChangeCallback) onQualityChangeCallback(quality);
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
          muted={muted}
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
          onProgress={(v) => onBufferProgress(v)}
        >
          {getVideos(videos, quality).map((video, i) => (
            <source src={video.src} type={video.type} key={i}></source>
          ))}
          Your browser does not support HTML5 video.
        </video>
        {controls ? (
          <VideoControls
            show={showControls}
            fullScreen={fullScreen}
            hoverControlsOnFullScreen={hoverControlsOnFullScreen}
          >
            <PlayIcons
              playing={isPlaying}
              togglePlay={() => togglePlay()}
              color={buttonsColor}
              onMouseMove={setMouseVideoMove}
            />
            <Controls
              onMouseEnter={() => {
                if (fullScreen) setHoverControlsOnFullScreen(true);
              }}
              onMouseLeave={() => {
                if (fullScreen) setHoverControlsOnFullScreen(false);
              }}
            >
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
