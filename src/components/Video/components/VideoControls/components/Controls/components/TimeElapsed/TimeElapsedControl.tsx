import React from "react";
import styled from "styled-components";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";
import { Duration } from "./types";

interface TimeElapsedControlProps {
  timeElapsed: Duration;
  color?: string;
}

const TimeElapsedControl = ({
  timeElapsed,
  color,
}: TimeElapsedControlProps) => {
  return (
    <Container color={color}>
      <time
        dateTime={`${timeElapsed.hours}h ${timeElapsed.minutes}m ${timeElapsed.seconds}s`}
      >
        {timeElapsed.hours}:{timeElapsed.minutes}:{timeElapsed.seconds}
      </time>
    </Container>
  );
};
export default TimeElapsedControl;

interface ContainerProps {
  color?: string;
}

const Container = styled.div`
  display: flex;
  time {
    color: ${(props: ContainerProps) =>
      props.color || INITIALCONFIGURATION.Time.COLOR};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 0.8em;
  }
`;
