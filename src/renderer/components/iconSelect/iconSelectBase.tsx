import classNames from "classnames";
import * as React from "react";

import { Alignment, Button, Classes, MenuItem } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import { type ItemRenderer, Select } from "@blueprintjs/select";

import { getIconNames } from "./iconNames";

const ICON_NAMES = getIconNames();

export interface IconSelectProps {
    disabled?: boolean;
    iconName?: IconName;
    onChange: (iconName?: IconName) => void;
}

export class IconSelectBase extends React.PureComponent<IconSelectProps> {
    public render() {
        const { disabled, iconName } = this.props;
        return (

            <label className={classNames("icon-select", Classes.LABEL, { [Classes.DISABLED]: disabled })}>
                <Select<IconName>
                    disabled={disabled}
                    items={ICON_NAMES}
                    itemPredicate={this.filterIconName}
                    itemRenderer={this.renderIconItem}
                    noResults={<MenuItem disabled={true} text="No results" />}
                    placeholder="Start typing to search…"
                    onItemSelect={this.handleIconChange}
                    popoverProps={{ minimal: true }}
                >
                    <Button
                        alignText={Alignment.LEFT}
                        textClassName={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        disabled={disabled}
                        fill={true}
                        icon={iconName}
                        text={iconName || "None"}
                        rightIcon="caret-down"
                    />
                </Select>
            </label>
        );
    }

    private renderIconItem: ItemRenderer<IconName | undefined> = (icon, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                roleStructure="listoption"
                active={modifiers.active}
                selected={this.props.iconName === icon}
                icon={icon}
                key={icon}
                onClick={e => {
                  console.log(icon);
                  e.stopPropagation()
                  e.preventDefault();
                  handleClick(e)
                }}
                onFocus={handleFocus}
                text={icon}
            />
        );
    };

    private filterIconName = (query: string, iconName: IconName | undefined) => {
        if (query === "") {
            return iconName === this.props.iconName;
        }
        return iconName!.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    private handleIconChange = (icon: IconName) => {
        this.props.onChange(icon === this.props.iconName ? undefined : icon);
    };
}
