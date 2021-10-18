import React, { useRef, useState } from "react";
import styled from "styled-components";
import { formatTime, getPercentageOfTotal } from "../../../../../../tools";
import { VideoTags } from "../../../../../../types";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";
import { Duration } from "../TimeElapsed/types";

interface VideoProgressProps {
  max: number;
  progress: number;
  buffered: number;
  onSkip: (value: number) => void;
  tags?: VideoTags[];
  bufferedColor?: string;
  backgroundBarColor?: string;
  barColor?: string;
  textColor?: string;
  thumbColor?: string;
}

const VideoProgress = ({
  max,
  progress,
  onSkip,
  buffered,
  tags,
  bufferedColor,
  backgroundBarColor,
  barColor,
  thumbColor,
  textColor,
}: VideoProgressProps) => {
  const seekRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dataSeek, setDataSeek] = useState<number>(0);
  const [tooltipTime, setTooltipTime] = useState<Duration>({
    minutes: "00",
    seconds: "00",
    hours: "00",
  });

  const updateTooltip = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const seek = seekRef.current;
    const tooltip = tooltipRef.current;
    if (seek && tooltip) {
      const clientWidth = event.currentTarget.clientWidth;
      const offsetX = event.nativeEvent.offsetX;
      const skipTo = Math.round(
        (offsetX / clientWidth) * parseInt(max.toString(), 10)
      );
      setDataSeek(skipTo);
      const time = formatTime(skipTo);
      setTooltipTime(time);
      tooltip.style.left = `${Math.round((skipTo / max) * 100)}%`;
    }
  };

  // skipAhead jumps to a different point in the video when the progress bar
  // is clicked
  const skipAhead = (event: React.FormEvent<HTMLInputElement>) => {
    const seek = Number(event.currentTarget.dataset.seek);
    const skipTo = seek ? seek : Number(event.currentTarget.value);

    onSkip(skipTo);
  };

  //console.log({ progress });

  return (
    <VideoProgressStyled>
      {tags ? (
        <>
          {tags.map((tag, i) => {
            const percent = getPercentageOfTotal(max, tag.time);
            return (
              <Tag key={i} style={{ left: percent }} color={textColor}>
                <TagSpan>{tag.tag}</TagSpan>
              </Tag>
            );
          })}
        </>
      ) : null}
      <Seek
        ref={seekRef}
        id="seek"
        value={progress}
        min="0"
        type="range"
        step="1"
        max={max}
        buffered={buffered * 100}
        progress={(progress / max) * 100}
        onMouseMove={(event) => updateTooltip(event)}
        //onInput={(event) => skipAhead(event)}
        onChange={(event) => skipAhead(event)}
        //onChange={(ev) => console.log(ev.currentTarget.value)}
        data-seek={dataSeek}
        bufferedColor={bufferedColor}
        barColor={barColor}
        backgroundBarColor={backgroundBarColor}
        thumbColor={thumbColor}
      />
      <Tooltip ref={tooltipRef} color={textColor}>
        <span>
          {tooltipTime.hours}:{tooltipTime.minutes}:{tooltipTime.seconds}
        </span>
      </Tooltip>
    </VideoProgressStyled>
  );
};

export default VideoProgress;
const VideoProgressStyled = styled.div`
  position: relative;
  height: 1.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
`;
interface TooltipProps {
  color?: string;
}

const Tooltip = styled.div`
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: -30px;
  left: 0;
  margin-left: -15px;
  font-size: 12px;
  padding: 3px;
  content: attr(data-title);
  font-weight: bold;
  color: ${(props: TooltipProps) =>
    props.color || INITIALCONFIGURATION.BUTTONCOLOR};
  background-color: transparent;
  transition: visibility 0.25s ease-out, opacity 0.25s ease-out,
    transform 0.25s ease-out;
  transform: translateY(0.5rem);
`;

interface TagProps {
  color?: string;
}
const Tag = styled.div`
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: -30px;
  left: 0;
  margin-left: -15px;
  font-size: 12px;
  padding: 3px;
  content: attr(data-title);
  font-weight: bold;
  color: ${(props: TagProps) =>
    props.color || INITIALCONFIGURATION.BUTTONCOLOR};
  background-color: transparent;
  transition: visibility 0.25s ease-out, opacity 0.25s ease-out,
    transform 0.25s ease-out;
  transform: translateY(0.5rem);
`;
const TagSpan = styled.span`
  font-size: 0.8rem;
`;

interface SeekProps {
  progress: number;
  buffered: number;
  bufferedColor?: string;
  backgroundBarColor?: string;
  barColor?: string;
  thumbColor?: string;
}

const Seek = styled.input`
  -webkit-appearance: none;
  height: 8px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  opacity: 0.7;
  width: 100%;
  background: ${(props: SeekProps) => `linear-gradient(
    to right,
    ${props.barColor || INITIALCONFIGURATION.ProgressBar.PROGRESSCOLOR} 0%,
    ${props.barColor || INITIALCONFIGURATION.ProgressBar.PROGRESSCOLOR} ${
    props.progress
  }%,
    ${props.bufferedColor || INITIALCONFIGURATION.ProgressBar.BUFFEREDCOLOR} ${
    props.progress
  }%,
    ${props.bufferedColor || INITIALCONFIGURATION.ProgressBar.BUFFEREDCOLOR} ${
    props.buffered
  }%,
    ${
      props.backgroundBarColor ||
      INITIALCONFIGURATION.ProgressBar.BACKGROUNDCOLOR
    } ${props.buffered}%,
    ${
      props.backgroundBarColor ||
      INITIALCONFIGURATION.ProgressBar.BACKGROUNDCOLOR
    } 100%
  )`};
  margin: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props: SeekProps) =>
      props.thumbColor || INITIALCONFIGURATION.ProgressBar.THUMBCOLOR};
    cursor: pointer;
    transition: opacity 0.2s;
  }
  &::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props: SeekProps) =>
      props.thumbColor || INITIALCONFIGURATION.ProgressBar.THUMBCOLOR};
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  &:hover + ${Tooltip} {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    transition: visibility 0.4s ease, opacity 0.4s ease, transform 0.4s ease;
  }
  &:hover + ${Tag} {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    transition: visibility 0.4s ease, opacity 0.4s ease, transform 0.4s ease;
  }

  &:hover {
    opacity: 1;
    transition: opacity 0.2s;
    &::-webkit-slider-thumb {
      opacity: 1;
      transition: opacity 0.4s;
    }
    &::-moz-range-thumb {
      opacity: 1;
      transition: opacity 0.4s;
    }
`;

const Progress = styled.progress`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 2px;
  width: 100%;
  height: 8.4px;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  &::-webkit-progress-bar {
    background-color: #474545;
    border-radius: 2px;
  }
  &::-webkit-progress-value {
    background: var(--youtube-red);
    border-radius: 2px;
  }
  &::-moz-progress-bar {
    border: 1px solid var(--youtube-red);
    background: var(--youtube-red);
  }
`;

const TagsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8.5px;
`;
