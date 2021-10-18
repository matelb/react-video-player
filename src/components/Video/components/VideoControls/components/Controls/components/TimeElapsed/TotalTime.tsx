import React from "react";
import styled from "styled-components";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";
import { Duration } from "./types";

interface TotalTimeProps {
  duration: Duration;
  color?: string;
}

const TotalTime = ({ duration, color }: TotalTimeProps) => {
  return (
    <Container color={color}>
      <time
        dateTime={`${duration.hours}h ${duration.minutes}m ${duration.seconds}s`}
      >
        -{duration.hours}:{duration.minutes}:{duration.seconds}
      </time>
    </Container>
  );
};
export default TotalTime;

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
