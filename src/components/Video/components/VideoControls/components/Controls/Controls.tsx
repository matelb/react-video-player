import React from "react";
import styled from "styled-components";

interface ControlsProps {
  children?: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Controls = ({ children, onMouseLeave, onMouseEnter }: ControlsProps) => {
  return (
    <ControlsStyled
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      {children}
    </ControlsStyled>
  );
};
export default Controls;
const ControlsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
