import React, { useState } from "react";
import styled from "styled-components";
import cn from "classnames";
import styles from "./VideControls.module.scss";
import { CONTROLSHIDETIME } from "./Utilities/Config";

interface VideoControlsProps {
  children?: React.ReactNode;
  show?: boolean;
  onClick?: () => void;
  fullScreen?: boolean;
  hoverControlsOnFullScreen?: boolean;
}

const VideoControls = ({
  children,
  show,
  onClick,
  fullScreen,
  hoverControlsOnFullScreen,
}: VideoControlsProps) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!fullScreen) return;
    setShowControls(true);
    let timeout;
    (() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, CONTROLSHIDETIME);
    })();
  };

  const getShowControls = () => {
    if (hoverControlsOnFullScreen) return hoverControlsOnFullScreen;

    return show || showControls;
  };

  return (
    <VideoControlsStyled
      className={cn({ [styles.show]: getShowControls() })}
      onMouseEnter={() => {
        if (!fullScreen) {
          setShowControls(true);
        }
      }}
      onMouseLeave={() => {
        if (!fullScreen) {
          setShowControls(false);
        }
      }}
      onMouseMove={(event) => onMouseMove(event)}
    >
      {children}
    </VideoControlsStyled>
  );
};
export default VideoControls;

const VideoControlsStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  right: 0;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  padding: 10px;
  position: absolute;
  bottom: 0;
  cursor: pointer;
  transition: visibility 0.8s ease-out, opacity 0.8s ease-out,
    transform 0.25s ease-out;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.89)
  );
  transform: translateY(3rem);
`;
