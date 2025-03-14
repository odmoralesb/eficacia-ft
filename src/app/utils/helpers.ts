import { Options } from "@tq/tq-elements";

export function cloneObject<T>(oldObject: T) {
    return JSON.parse(JSON.stringify(oldObject)) as T
}

export function getLastTenYears(): Options {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, index) => {
        const year = currentYear - index;
        return {
            label: year.toString(),
            value: year,
            selected: index === 0
        };
    });
};