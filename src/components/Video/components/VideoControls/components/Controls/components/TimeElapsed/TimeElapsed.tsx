import React from "react";
import styled from "styled-components";
import { COLORBASE } from "../../../../Utilities/Color";
import { Duration } from "./types";

interface TimeElapsedProps {
  children?: React.ReactNode;
  duration: Duration;
  timeElapsed: Duration;
}

const TimeElapsed = ({ children, duration, timeElapsed }: TimeElapsedProps) => {
  return (
    <TimeElapsedStyled>
      <time dateTime={`${timeElapsed.minutes}m ${timeElapsed.seconds}s`}>
        {timeElapsed.minutes}:{timeElapsed.seconds}
      </time>
      <span>/</span>
      <time dateTime={`${duration.minutes}m ${duration.seconds}s`}>
        {duration.minutes}:{duration.seconds}
      </time>
    </TimeElapsedStyled>
  );
};
export default TimeElapsed;

const TimeElapsedStyled = styled.div`
  span {
    color: ${COLORBASE};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  time {
    color: ${COLORBASE};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 0.8em;
  }
`;
