import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";

interface PIPProps {
  children?: React.ReactNode;
  togglePip: () => Promise<void>;
  disabled?: boolean;
  color?: string;
}

const PIP = ({ children, togglePip, disabled, color }: PIPProps) => {
  const [showPIP, setShowPIP] = useState<boolean>(false);
  useEffect(() => {
    if (!("pictureInPictureEnabled" in document)) {
      setShowPIP(false);
    } else {
      setShowPIP(true);
    }
  }, []);

  return (
    <>
      {showPIP ? (
        <PIPStyled onClick={() => togglePip()} disabled={disabled}>
          <SVG viewBox="0 0 24 24" color={color}>
            <path d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
          </SVG>
        </PIPStyled>
      ) : null}
    </>
  );
};
export default PIP;
const PIPStyled = styled.button`
  background: transparent;
  cursor: pointer;
  outline: none;
  border: none;
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
`;
