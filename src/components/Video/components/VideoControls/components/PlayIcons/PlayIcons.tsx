import React from "react";
import styled from "styled-components";
import { StyleSheet, css } from "aphrodite/no-important";
import { INITIALCONFIGURATION } from "../../Utilities/Config";

interface PlayIconsProps {
  children?: React.ReactNode;
  playing?: boolean;
  color?: string;
  togglePlay: () => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const PlayIcons = ({
  playing,
  color,
  togglePlay,
  onMouseMove,
}: PlayIconsProps) => {
  const strokePlay = {
    strokeWidth: 6,
    stroke: color || INITIALCONFIGURATION.BUTTONCOLOR,
    strokeLinejoin: "round",
    strokeLinecap: "round",
    fill: color || INITIALCONFIGURATION.BUTTONCOLOR,
  };
  const strokePause = {
    strokeWidth: 2,
    stroke: color || INITIALCONFIGURATION.BUTTONCOLOR,
    strokeLinejoin: "round",
    strokeLinecap: "round",
    fill: color || INITIALCONFIGURATION.BUTTONCOLOR,
  };

  const stylesAphrodite = StyleSheet.create({
    strokePlay: {
      ...strokePlay,
    },
    strokePause: {
      ...strokePause,
    },
  });

  return (
    <Container
      onClick={() => togglePlay()}
      onMouseMove={(event) => onMouseMove(event)}
    >
      <PlayIconsStyled data-title={playing ? "Pause (k)" : "Play (k)"}>
        {!playing ? (
          <svg viewBox="0 0 30 30">
            <path
              className={css(stylesAphrodite.strokePlay)}
              d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"
            ></path>
          </svg>
        ) : (
          <svg viewBox="0 0 30 30">
            <path
              className={css(stylesAphrodite.strokePause)}
              d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"
            ></path>
          </svg>
        )}
      </PlayIconsStyled>
    </Container>
  );
};
export default PlayIcons;

//background-color: rgba(0, 0, 0, 0.6);

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PlayIconsStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -40px;
  margin-top: -40px;
  width: 80px;
  height: 80px;
  border-radius: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
`;
