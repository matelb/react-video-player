import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Color } from "../../../Utilities/Color";
import { useOutside } from "../../../Utilities/outsideHook";

export type OptionValue = string | number;

export interface SelectOptionsProps {
  key: OptionValue;
  value: OptionValue;
  text: OptionValue;
}

type backgroundType = "normal" | "blur";

interface SelectProps {
  label?: string;
  placeholder?: string;
  search?: boolean;
  options: SelectOptionsProps[];
  onChange?: (value: OptionValue) => void;
  id?: string;
  name?: string;
  value?: OptionValue;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  background?: backgroundType;
}

const Select = ({
  label,
  placeholder,
  id,
  name,
  search,
  options,
  onChange,
  value,
  className,
  disabled,
  required,
  background,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    SelectOptionsProps | undefined
  >(undefined);

  const [slug, setslug] = useState<string | undefined>("");
  const currentslug = useRef<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (item: SelectOptionsProps) => () => {
    if (disabled) return;
    if (onChange && item) {
      onChange(item.value);
      currentslug.current = item.text.toString();
    } else {
      if (item) {
        setSelectedItem(item);
        currentslug.current = item.text.toString();
        setslug(item.text.toString());
      }
    }

    setIsOpen(false);
  };

  useOutside(ref, () => {
    callback();
  });

  const callback = useCallback(() => {
    setIsOpen(false);
    setslug(currentslug.current);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = event.target.value;
    setslug(value);
  };

  const handleSearchClick = () => {
    if (disabled) return;
    setslug("");
  };

  const getHeaderText = () => {
    if (value) {
      return options.find((x) => x.value === value)?.text;
    } else if (selectedItem) {
      return selectedItem.text;
    }

    return placeholder;
  };

  const renderHeader = () => {
    if (search) {
      return (
        <>
          <DropDownHeader isOpen={isOpen} onClick={toggling}>
            <InputSearch
              id={id}
              name={name}
              type={"text"}
              value={
                value
                  ? (options as SelectOptionsProps[]).find(
                      (x) => x.value === value
                    )?.text
                  : slug
              }
              placeholder={placeholder || label}
              isOpen={isOpen}
              onChange={(event) => handleSearch(event)}
              onClick={() => handleSearchClick()}
              disabled={disabled}
              required={required}
            />
            <i className="fa fa-caret-down"></i>
          </DropDownHeader>
        </>
      );
    }
    return (
      <DropDownHeader
        isOpen={isOpen}
        onClick={toggling}
        background={background}
      >
        <Title isOpen={isOpen}>{getHeaderText()}</Title>
        <i className="fa fa-caret-down"></i>
      </DropDownHeader>
    );
  };
  return (
    <DropDownContainer ref={ref} aria-expanded={isOpen} className={className}>
      <Label>{label}</Label>
      {renderHeader()}
      {isOpen && (
        <DropDownListContainer
          style={{
            width: ref.current?.getBoundingClientRect().width,
            height:
              options.length < 8
                ? `calc(2rem * ${options.length}.3)`
                : "calc(2rem * 8.3)",
            top:
              options.length < 8
                ? `calc(-2rem * ${options.length}.3)`
                : "calc(-2rem * 8.3)",
          }}
        >
          <DropDownList background={background}>
            {options
              .filter((x) =>
                !slug || !search
                  ? true
                  : x.text.toString().toLowerCase().includes(slug.toLowerCase())
              )
              .map((item) => {
                const { key, text, value } = item;
                return (
                  <ListItem
                    onClick={onOptionClicked(item)}
                    key={key}
                    selected={key === selectedItem?.key}
                  >
                    <ListItemText>{text}</ListItemText>
                  </ListItem>
                );
              })}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default Select;

interface DropDownHeaderProps {
  isOpen: boolean;
  background?: backgroundType;
}
interface DropDownListProps {
  background?: backgroundType;
}
// margin: 0 auto;
// z-index: 10;

const DropDownContainer = styled.div`
  width: 100%;
  position: relative;
`;

const InputSearch = styled.input`
  border: none;
  left: 1px;
  top: 0;
  box-shadow: none;
  background: none;
  width: 100%;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  line-height: 2rem;
  font-weight: ${(props: DropDownHeaderProps) => (props.isOpen ? 400 : 400)};
  -webkit-appearance: none;
  cursor: auto;
  outline: 0;
`;

const DropDownHeader = styled.div`
  // padding: 0.4rem 1rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  border-radius: 5px;
  border-top-left-radius: ${(props: DropDownHeaderProps) =>
    props.isOpen ? "0" : "5px"};
  border-top-right-radius: ${(props: DropDownHeaderProps) =>
    props.isOpen ? "0" : "5px"};
  border-bottom: ${(props: DropDownHeaderProps) =>
    props.isOpen ? `1px solid ${Color.LIGHTBLUE}` : "none"};
  border-left: ${(props: DropDownHeaderProps) =>
    props.isOpen ? `1px solid ${Color.LIGHTBLUE}` : "none"};
  border-right: ${(props: DropDownHeaderProps) =>
    props.isOpen ? `1px solid ${Color.LIGHTBLUE}` : "none"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2rem;
  background-color: ${(props: DropDownHeaderProps) =>
    props.background === "blur" ? `rgba(248, 248, 248, 0.8)` : "#ffffff"};
  backdrop-filter: ${(props: DropDownHeaderProps) =>
    props.background === "blur" ? `saturate(180%) blur(20px)` : "none"};
  -webkit-backdrop-filter: ${(props: DropDownHeaderProps) =>
    props.background === "blur" ? `saturate(180%) blur(20px)` : "none"};
`;

const Title = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.8rem;
  line-height: 1.3rem;
  font-weight: ${(props: DropDownHeaderProps) => (props.isOpen ? 400 : 400)};
  padding: 0 0.2rem;
`;
//  top: 100%;
//height: calc(3rem * 8.3);
// z-index: 11;
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
  border-bottom: none;
  border-bottom-left-radius: 3px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${(props: DropDownListProps) =>
    props.background === "blur" ? `rgba(248, 248, 248, 0.8)` : "#ffffff"};
`;

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: ${(props: DropDownListProps) =>
    props.background === "blur" ? `rgba(248, 248, 248, 0.8)` : "#ffffff"};
  backdrop-filter: ${(props: DropDownListProps) =>
    props.background === "blur" ? `saturate(180%) blur(20px)` : "none"};
  -webkit-backdrop-filter: ${(props: DropDownListProps) =>
    props.background === "blur" ? `saturate(180%) blur(20px)` : "none"};
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
  padding: 0 0.2rem;
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
