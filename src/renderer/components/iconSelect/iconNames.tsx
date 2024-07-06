import { type IconName, IconNames } from "@blueprintjs/icons";

export function getIconNames(): IconName[] {
    const iconNames = new Set<IconName>();
    for (const [, name] of Object.entries(IconNames)) {
        iconNames.add(name);
    }
    return Array.from(iconNames.values());
}
