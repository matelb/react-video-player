import React from "react";
import styled from "styled-components";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";

interface FullScreenProps {
  children?: React.ReactNode;
  fullScreen?: boolean;
  color?: string;
  toggleFullScreen: () => void;
}

const FullScreen = ({
  fullScreen,
  toggleFullScreen,
  color,
}: FullScreenProps) => {
  return (
    <FullScreenStyled onClick={() => toggleFullScreen()}>
      {!fullScreen ? (
        <SVG viewBox="0 0 24 24" color={color}>
          {/* <path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path> */}
          {expand}
        </SVG>
      ) : (
        <SVG viewBox="0 0 24 24" color={color}>
          <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
        </SVG>
      )}
    </FullScreenStyled>
  );
};
export default FullScreen;
const FullScreenStyled = styled.button`
  background: transparent;
  cursor: pointer;
  outline: none;
  border: none;
  margin-right: 0;
`;

interface SVGProps {
  color?: string;
}

const SVG = styled.svg`
  width: 26px;
  height: 26px;
  path {
    fill: ${(props: SVGProps) =>
      props.color || INITIALCONFIGURATION.BUTTONCOLOR};
  }
  polygon {
    fill: ${(props: SVGProps) =>
      props.color || INITIALCONFIGURATION.BUTTONCOLOR};
  }
`;

const expand = (
  <>
    <polygon
      points="352.054,113.995 352.054,0 238.059,0 238.059,30 300.84,30 186.633,144.208 207.846,165.42 322.054,51.213 322.054,113.995 "
      id="polygon52"
      transform="matrix(0.06045182,0,0,0.06045218,-1.282304,0)"
    />
    <polygon
      points="30,238.059 0,238.059 0,352.054 113.995,352.054 113.995,322.054 51.212,322.054 165.419,207.847 144.206,186.634 30,300.84 "
      id="polygon50"
      style={{ display: "inline" }}
      transform="matrix(0.06045256,0,0,0.06045218,0,-1.2824327)"
    />
  </>
);
