import * as React from "react";

import { Button, ControlGroup, FormGroup, HTMLSelect, Intent } from "@blueprintjs/core";
import { handleValueChange } from "@blueprintjs/docs-theme";

const INTENTS = [
    { label: "None", value: Intent.NONE },
    { label: "Primary", value: Intent.PRIMARY },
    { label: "Success", value: Intent.SUCCESS },
    { label: "Warning", value: Intent.WARNING },
    { label: "Danger", value: Intent.DANGER },
];

export interface IntentSelectProps {
    intent: Intent;
    label?: React.ReactNode;
    onChange: (intent: Intent) => void;
    /** @default false */
    showClearButton?: boolean;
}

export const IntentSelect: React.FC<IntentSelectProps> = ({ label, intent, showClearButton, onChange }) => {
    const handleChange = handleValueChange(onChange);
    const handleClear = React.useCallback(() => onChange("none"), [onChange]);
    return (
        <FormGroup label={label}>
            <ControlGroup>
                <HTMLSelect value={intent} onChange={handleChange} options={INTENTS} fill={true} />
                {showClearButton && (
                    <Button aria-label="Clear" disabled={intent === "none"} icon="cross" onClick={handleClear} />
                )}
            </ControlGroup>
        </FormGroup>
    );
};
IntentSelect.defaultProps = {
    label: "Intent",
};
