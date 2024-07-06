import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select, ItemListRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as Icons from "@mui/icons-material";
import { snakeCase, camelCase }  from  "lodash";

import PropTypes from 'prop-types';

const generateIcon = (variation: string, props = {}) => {
  const IconName = Icons[variation];
  return <IconName {...props} />;
};

export interface Icon {
    value: string;
    name: string;
}

// const ICON_LIST: Icon[] = [
//     { title: "The Shawshank Redemption", year: 1994 },
//     { title: "The Godfather", year: 1972 },
//     // ...
// ].map((f, index) => ({ ...f, rank: index + 1 }));

function getIconNamesMaterial(): Icon[] {
  const iconStyles = ["Filled", "Outlined", "Rounded", "TwoTone", "Sharp"];
  return Object.entries(Icons).filter(
      ([key, value], i) => iconStyles.filter((style) => key.endsWith(style)).length === 0
    )
    .map(([key]) => ({name: key, value: snakeCase(key)}));
}
const ICON_LIST = getIconNamesMaterial();

const filterIcon: ItemPredicate<Icon> = (query, icon, _index, exactMatch) => {
    const normalizedTitle = icon.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${icon.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
};

const renderIcon: ItemRenderer<Icon> = (icon, { handleClick, handleFocus, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={icon.value}
            // label={icon.name.toString()}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            text={`${icon.name}`}
            labelElement={generateIcon(icon.name)}
        />
    );
};
/*
const renderMenu: ItemListRenderer<Icon> = ({ items, itemsParentRef, query, renderItem, menuProps }) => {
  const renderedItems = items.map(renderItem).filter(item => item != null);
  return (
      <Menu role="listbox" ulRef={itemsParentRef} {...menuProps}>
          <MenuItem
              disabled={true}
              text={`Found ${renderedItems.length} items matching "${query}"`}
              roleStructure="listoption"
          />
          {renderedItems}
      </Menu>
  );
};
*/
const upperFirst = (str: string) => str ? (str.charAt(0).toUpperCase() + str.slice(1)): str;
export const IconSelect: React.FC = (props: {
  disabled?: boolean,
  value?: any,
  onConfirm?: (icon: Icon) => void,
  onChange?: (icon: Icon) => void,
  placeholder?: string,
}) => {
    const icon = props?.value ? {value: props.value, name: upperFirst(camelCase(props.value))} : undefined;
    const [selectedIcon, setSelectedIcon] = React.useState<Icon | undefined>(icon);
    return (
        <Select<Icon>
            disabled={props.disabled}
            initialContent={null}
            items={ICON_LIST}
            // itemListRenderer={renderMenu}
            itemPredicate={filterIcon}
            itemRenderer={renderIcon}
            noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={icon =>{
              props.onChange && props.onChange(icon);
              props.onConfirm && props.onConfirm(icon);
              setSelectedIcon(icon);
            }}

        >
            <Button text={''} rightIcon="double-caret-vertical" placeholder={props.placeholder ?? 'Select a icon'}>
              {selectedIcon?.name ? generateIcon(selectedIcon?.name): ' — '}
            </Button>
        </Select>
    );
};
