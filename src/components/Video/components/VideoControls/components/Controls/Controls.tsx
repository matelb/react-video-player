import React from "react";
import styled from "styled-components";

interface ControlsProps {
  children?: React.ReactNode;
}

const Controls = ({ children }: ControlsProps) => {
  return <ControlsStyled>{children}</ControlsStyled>;
};
export default Controls;
const ControlsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
