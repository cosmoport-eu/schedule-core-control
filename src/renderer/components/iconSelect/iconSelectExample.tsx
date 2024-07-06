import * as React from "react";

import { H5, Icon, Intent, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { type IconName, IconSize } from "@blueprintjs/icons";

import { IconSelectBase } from "./iconSelectBase";
import { IntentSelect } from "./intentSelect";

export interface IconExampleState {
    icon: IconName;
    iconSize: number;
    intent: Intent;
}

export class IconSelectExample extends React.PureComponent<ExampleProps, IconExampleState> {
    public state: IconExampleState = {
        icon: "calendar",
        iconSize: IconSize.STANDARD,
        intent: Intent.NONE,
    };

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });

    private iconSizeLabelId = "icon-size-label";

    public render() {
        const { icon, iconSize, intent } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <IconSelectBase iconName={icon} onChange={this.handleIconNameChange} />
                <IntentSelect intent={this.state.intent} onChange={this.handleIntentChange} />
                <Label id={this.iconSizeLabelId}>Icon size</Label>
                <Slider
                    labelStepSize={MAX_ICON_SIZE / 5}
                    min={0}
                    max={MAX_ICON_SIZE}
                    showTrackFill={false}
                    value={iconSize}
                    onChange={this.handleIconSizeChange}
                    handleHtmlProps={{ "aria-labelledby": this.iconSizeLabelId }}
                />
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
