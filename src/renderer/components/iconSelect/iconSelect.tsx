import * as React from "react";

import { H5, Icon, Intent, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { type IconName, IconSize } from "@blueprintjs/icons";

import { IconSelectBase } from "./iconSelectBase";

export interface IconState {
    icon: IconName;
    iconSize: number;
    intent: Intent;
}

export class IconSelect extends React.PureComponent<ExampleProps, IconState> {
    public state: IconState = {
        icon: "calendar",
        iconSize: IconSize.STANDARD,
        intent: Intent.NONE,
    };
    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
    public render() {
        const { icon, iconSize, intent } = this.state;

        const options = (
            <>
                <IconSelectBase iconName={icon} onChange={this.handleIconNameChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <Icon icon={icon} size={iconSize} intent={intent} />
            </Example>
        );
    }
}

const MAX_ICON_SIZE = 100;
