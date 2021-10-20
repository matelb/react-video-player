import React, { useState } from "react";
import styled from "styled-components";
import { VideoQuality } from "../../../../../../types";
import { Color } from "../../../../Utilities/Color";
import Select from "../../../Common/Select";

interface QualitySelectProps {
  qualities: VideoQuality[];
  disabled?: boolean;
  onChange?: (value: VideoQuality) => void;
}

const QualitySelect = ({
  qualities,
  disabled,
  onChange,
}: QualitySelectProps) => {
  const [value, setValue] = useState<VideoQuality>(qualities[0]);
  const [open, setOpen] = useState<boolean>(false);

  const onOptionClicked = (item: VideoQuality) => () => {
    if (disabled) return;
    if (onChange && item) {
      onChange(value);
    } else {
      if (item) {
        setValue(item);
      }
    }
    setOpen(false);
  };

  return (
    <Container>
      <Button onClick={() => setOpen(!open)}>
        <SVG viewBox="0 0 24 24">
          <g
            transform="matrix(0.00387549,0,0,-0.0038753,0,19.842506)"
            fill="white"
            stroke="none"
            id="g25"
          >
            <path
              d="m 2281,5104 c -80,-21 -149,-62 -212,-124 -95,-93 -139,-206 -139,-350 v -87 l -87,-33 c -49,-18 -121,-48 -162,-67 l -75,-34 -55,55 c -140,136 -305,185 -476,141 -102,-27 -160,-69 -326,-234 -165,-166 -207,-224 -234,-326 -44,-171 5,-336 141,-475 l 54,-56 -44,-99 c -24,-55 -54,-128 -66,-162 l -23,-63 H 490 C 346,3190 234,3146 139,3051 23,2934 0,2854 0,2560 c 0,-295 22,-371 140,-491 93,-95 206,-139 350,-139 h 87 l 33,-87 c 18,-49 48,-121 67,-162 l 34,-75 -55,-55 c -30,-31 -68,-78 -85,-106 -90,-144 -94,-334 -9,-484 42,-75 324,-357 399,-399 142,-80 319,-82 463,-4 28,15 80,55 117,89 l 66,63 99,-43 c 55,-24 127,-54 162,-67 l 62,-22 v -87 c 0,-145 44,-258 139,-351 C 2189,22 2265,0 2560,0 c 294,0 374,23 491,139 95,95 139,207 139,352 v 87 l 63,22 c 34,13 106,43 161,67 l 99,43 66,-63 c 37,-34 89,-74 117,-89 141,-76 316,-76 458,0 67,36 360,328 403,402 81,139 83,319 5,464 -15,28 -55,80 -89,117 l -63,66 43,99 c 24,55 54,127 67,162 l 22,62 h 87 c 148,0 256,43 351,139 118,120 140,196 140,491 0,295 -22,371 -140,491 -95,96 -203,139 -351,139 h -87 l -22,63 c -13,34 -43,106 -67,161 l -43,99 63,66 c 34,37 74,89 89,117 78,144 76,321 -4,463 -42,74 -334,366 -404,403 -150,81 -338,76 -479,-13 -27,-17 -75,-55 -106,-85 l -55,-55 -75,34 c -41,19 -113,49 -161,67 l -88,33 v 87 c 0,144 -44,256 -139,351 -63,63 -131,101 -218,124 -79,21 -474,20 -552,-1 z m 516,-305 c 29,-14 52,-35 68,-63 23,-40 25,-52 25,-184 0,-158 12,-209 59,-240 14,-10 85,-37 156,-61 72,-23 193,-74 270,-112 77,-38 150,-69 163,-69 48,0 99,34 196,130 104,102 133,120 191,120 60,0 88,-19 229,-158 141,-140 166,-175 166,-236 0,-59 -18,-88 -120,-192 -97,-98 -130,-148 -130,-197 0,-13 31,-87 70,-164 38,-78 88,-199 111,-269 24,-71 51,-141 61,-155 31,-47 82,-59 240,-59 132,0 144,-2 184,-25 75,-44 84,-78 84,-305 0,-227 -9,-261 -84,-305 -40,-23 -52,-25 -184,-25 -158,0 -209,-12 -240,-59 -10,-14 -37,-84 -61,-155 -23,-70 -73,-191 -111,-269 -39,-77 -70,-151 -70,-164 0,-49 33,-99 130,-197 102,-104 120,-133 120,-191 0,-60 -19,-87 -157,-227 -142,-143 -177,-168 -236,-168 -60,0 -88,18 -193,120 -98,97 -148,130 -198,130 -13,0 -87,-31 -163,-69 -76,-38 -196,-89 -268,-112 -71,-24 -142,-51 -156,-61 -47,-31 -59,-82 -59,-240 0,-132 -2,-144 -25,-184 -44,-75 -78,-84 -305,-84 -227,0 -261,9 -305,84 -23,40 -25,52 -25,184 0,158 -12,209 -59,240 -14,10 -84,38 -156,61 -71,24 -193,74 -269,112 -77,38 -150,69 -163,69 -49,0 -99,-33 -197,-130 -104,-102 -133,-120 -192,-120 -61,0 -96,25 -236,166 -139,141 -158,169 -158,229 0,58 18,87 120,191 97,98 130,148 130,197 0,13 -31,87 -70,164 -38,78 -88,199 -111,269 -24,71 -51,141 -61,155 -31,47 -82,59 -240,59 -132,0 -144,2 -184,25 -75,44 -84,78 -84,305 0,227 9,261 84,305 40,23 52,25 184,25 158,0 209,12 240,59 10,14 38,85 61,156 23,72 74,193 112,269 38,77 69,150 69,163 0,49 -33,99 -130,197 -102,104 -120,133 -120,192 0,61 25,96 166,236 141,139 169,158 229,158 58,0 87,-18 191,-120 98,-97 148,-130 197,-130 13,0 87,31 164,70 78,38 199,88 269,111 71,24 141,51 155,61 47,31 59,82 59,240 0,132 2,144 25,183 16,28 39,50 67,64 39,19 60,21 237,21 177,0 199,-2 238,-21 z"
              id="path21"
            />
            <path
              d="m 2335,3650 c -416,-90 -742,-398 -853,-808 -24,-88 -26,-114 -26,-282 0,-168 2,-194 26,-282 105,-387 409,-691 796,-796 88,-24 114,-26 282,-26 168,0 194,2 282,26 387,105 691,409 796,796 24,88 26,114 26,282 0,168 -2,194 -26,282 -105,387 -411,694 -793,794 -139,37 -376,43 -510,14 z m 412,-300 c 370,-89 623,-409 623,-790 0,-454 -356,-810 -810,-810 -224,0 -415,79 -574,236 -271,269 -316,698 -106,1017 115,176 304,308 504,352 95,20 266,18 363,-5 z"
              id="path23"
            />
          </g>
        </SVG>
        <DropDownListContainer
          open={open}
          style={{
            height:
              qualities.length < 8
                ? `calc(2rem * ${qualities.length}.3)`
                : "calc(2rem * 8.3)",
            top:
              qualities.length < 8
                ? `calc(-2rem * ${qualities.length}.5)`
                : "calc(-2rem * 8.5)",
          }}
        >
          <DropDownList>
            {qualities.map((item, i) => {
              return (
                <ListItem
                  onClick={onOptionClicked(item)}
                  key={i}
                  selected={item === value}
                >
                  <ListItemText>{item}</ListItemText>
                </ListItem>
              );
            })}
          </DropDownList>
        </DropDownListContainer>
      </Button>
    </Container>
  );
};
export default QualitySelect;

const Container = styled.div`
  position: relative;
`;

const Button = styled.button`
  background: transparent;
  cursor: pointer;
  outline: none;
  border: none;
  margin-right: 0;
`;

const SVG = styled.svg`
  width: 26px;
  height: 26px;
`;

interface DropDownListContainerProps {
  open: boolean;
}

const DropDownListContainer = styled.div`
  z-index: 1;
  cursor: auto;
  position: absolute;
  right: 0;
  display: block;
  will-change: transform, opacity;
  overflow-x: hidden;
  overflow-y: visible;
  backface-visibility: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border: 1px solid ${Color.LIGHTBLUE};
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #ffffff;
  max-height: ${(props: DropDownListContainerProps) =>
    props.open ? "500px" : "0"};
  max-width: ${(props: DropDownListContainerProps) =>
    props.open ? "500px" : "0"};
  opacity: ${(props: DropDownListContainerProps) => (props.open ? "1" : "0")};
  visibility: ${(props: DropDownListContainerProps) =>
    props.open ? "visible" : "hidden"};
  transition: opacity 0.2s ease-out, max-height 0.8s ease-out,
    max-width 0.8s ease-out;
  overflow: hidden;
`;

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #ffffff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  &:first-child {
    padding-top: 0.2em;
  }
`;

interface ListItemProps {
  selected: boolean;
}
const ListItem = styled.li`
  list-style: none;
  line-height: 2rem;
  padding: 0 0.7rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: ${(props: ListItemProps) => (props.selected ? 700 : 400)};
  color: ${(props: ListItemProps) =>
    props.selected ? "rgba(0,0,0,.95)" : "rgba(0,0,0,.67)"};
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.95);
  }
`;
const ListItemText = styled.span`
  //padding-left: 0.7rem;
`;
const Label = styled.label`
  display: inline;
  margin-bottom: 0.5rem;
  transition: 0.2s;
  font-size: 0.8rem;
  color: #606770;
`;
