import React, { useRef, useState } from "react";
import styled from "styled-components";
import { INITIALCONFIGURATION } from "../../../../Utilities/Config";
import styles from "./Volume.module.scss";
import { isMobile, isTablet } from "react-device-detect";

export type VolumeLevel = "high" | "low" | "muted";

interface VolumeProps {
  volumeLevel?: VolumeLevel;
  buttonColor?: string;
  backgroundBarColor?: string;
  barColor?: string;
  thumbColor?: string;
  containerColor?: string;
  onChange: (value: string) => void;
  muted?: boolean;
  onClick: () => void;
}

const Volume = ({
  volumeLevel,
  buttonColor,
  onChange,
  onClick,
  backgroundBarColor,
  barColor,
  containerColor,
  thumbColor,
}: VolumeProps) => {
  const volumeRef = useRef<HTMLInputElement>(null);
  const [volumeValue, setVolumeValue] = useState<string>();
  const max = 100;
  const min = 0;
  const renderVolumeLevel = () => {
    if (!volumeLevel) return <High color={buttonColor} />;
    if (volumeLevel === "high") {
      return <High color={buttonColor} />;
    } else if (volumeLevel === "low") {
      return <Low color={buttonColor} />;
    } else {
      return <Mute color={buttonColor} />;
    }
  };

  const handleVolumeChange = (value: string) => {
    const volume = volumeRef.current;

    if (volume) {
      var range = max - min; //Obtenemos el rango total. Al restar siempre obtendremos valores de rango (%) positivos, aún cuando trabajemos con valores inferiores a 0. Luego lo veremos más en detalle con datalist.
      const currentValue = Number(value);
      var progressW = ((currentValue - min) / range) * 100 + "%"; //Guardamos en una variable el % de progreso que obtenemos mediante una regla de tres donde el rango es el valor que equivale al 100% y la parte en azul sería el valor actual cuyo % queremos obtener. La razón de restar el mínimo al valor es obtener un valor relativo al rango global, pues la escala no tiene por qué comenzar en 0, puede ser + ó -.
      const background = `linear-gradient(to right,${
        barColor || INITIALCONFIGURATION.VolumeBar.VOLUMECOLOR
      } 0%,${
        barColor || INITIALCONFIGURATION.VolumeBar.VOLUMECOLOR
      } ${progressW},${
        backgroundBarColor || INITIALCONFIGURATION.VolumeBar.BACKGROUNDCOLOR
      } ${progressW},${
        backgroundBarColor || INITIALCONFIGURATION.VolumeBar.BACKGROUNDCOLOR
      } 100%)`;
      volume.style.background = background;
      onChange(value);
    }
  };

  const handleClick = () => {
    //const volume = volumeRef.current;
    // if (volume) {
    //   debugger;
    //   if (volumeLevel === "muted") {
    //     setVolumeValue(volume.value);
    //     volume.value = " 0";
    //   } else {
    //     if (volume.dataset.volume) {
    //       volume.value = volume.dataset.volume;
    //     }
    //   }
    // }
    onClick();
  };

  return (
    <VolumeContainer className={styles.volumeControls}>
      {!isMobile && !isTablet ? (
        <VolumeBarContainer containerColor={containerColor}>
          <VolumeStyled
            ref={volumeRef}
            className={styles.volume}
            data-volume={volumeLevel}
            type="range"
            aria-orientation="vertical"
            onChange={(event) => handleVolumeChange(event.target.value)}
            thumbColor={thumbColor}
            barColor={barColor}
            backgroundBarColor={backgroundBarColor}
          />
        </VolumeBarContainer>
      ) : null}

      <Button
        data-title={volumeLevel === "muted" ? "Unmute (m)" : "Mute (m)"}
        onClick={() => handleClick()}
      >
        {renderVolumeLevel()}
      </Button>
    </VolumeContainer>
  );
};
export default Volume;

interface ColorProps {
  color?: string;
}
interface VolumeBarContainerProps {
  containerColor?: string;
}

const VolumeBarContainer = styled.div`
  visibility: hidden;
  position: absolute;
  background: ${(props: VolumeBarContainerProps) =>
    props.containerColor || INITIALCONFIGURATION.VolumeBar.CONTAINERCOLOR};
  top: 0;
  border-radius: 12px;
  display: flex;
  opacity: 0.7;
  cursor: pointer;
  padding: 7px 0;
  padding-left: 1px;
  padding-right: 10px;
  align-items: center;
  width: 0;
  transform: translateY(-0%) translateX(0%) rotate(-90deg);
  transition: visibility 0.3s ease-out, width 0.55s, transform 0.55s;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  &:hover {
    ${VolumeBarContainer} {
      visibility: visible;
      width: 8em;
      transform: translateY(-310%) rotate(-90deg);
      transition: visibility 0.75s ease-in, width 0.75s, transform 0.75s;
    }
  }
`;

interface VolumeStyledProps {
  backgroundBarColor?: string;
  barColor?: string;
  thumbColor?: string;
}

const VolumeStyled = styled.input`
  -webkit-appearance: none;
  outline: none;
  visibility: hidden;
  height: 9px;
  max-width: 0px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    ${(props: VolumeStyledProps) =>
        props.barColor || INITIALCONFIGURATION.VolumeBar.VOLUMECOLOR}
      0%,
    ${(props: VolumeStyledProps) =>
        props.barColor || INITIALCONFIGURATION.VolumeBar.VOLUMECOLOR}
      50%,
    ${(props: VolumeStyledProps) =>
      props.backgroundBarColor ||
      INITIALCONFIGURATION.VolumeBar.BACKGROUNDCOLOR}50%,
    ${(props: VolumeStyledProps) =>
        props.backgroundBarColor ||
        INITIALCONFIGURATION.VolumeBar.BACKGROUNDCOLOR}
      100%
  );
  transition: visibility 0.3s ease-out, max-width 0.55s;
  writing-mode: bt-lr; /* IE */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props: VolumeStyledProps) =>
      props.thumbColor || INITIALCONFIGURATION.VolumeBar.THUMBCOLOR};
    border-color: ${(props: VolumeStyledProps) =>
      props.thumbColor || INITIALCONFIGURATION.VolumeBar.THUMBCOLOR};
    cursor: pointer;
    transition: opacity 0.2s;
  }
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    opacity: 0;
    border-radius: 50%;
    background: ${(props: VolumeStyledProps) =>
      props.thumbColor || INITIALCONFIGURATION.VolumeBar.THUMBCOLOR};
    border-color: ${(props: VolumeStyledProps) =>
      props.thumbColor || INITIALCONFIGURATION.VolumeBar.THUMBCOLOR};
    cursor: pointer;
    transition: opacity 0.2s;
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
  }
`;

const Button = styled.button`
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
`;

const SVG = styled.svg`
  width: 1.3em;
  height: 1.3em;
  > path {
    fill: ${(props: ColorProps) =>
      props.color || INITIALCONFIGURATION.BUTTONCOLOR};
  }
`;

const High = ({ color }: ColorProps) => (
  <SVG viewBox="0 0 24 24" color={color}>
    <path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
  </SVG>
);
const Low = ({ color }: ColorProps) => (
  <SVG viewBox="0 0 24 24" color={color}>
    <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
  </SVG>
);
const Mute = ({ color }: ColorProps) => (
  <SVG viewBox="0 0 24 24" color={color}>
    <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
  </SVG>
);
