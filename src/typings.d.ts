// (C) 2007-2018 GoodData Corporation
declare module '*/package.json' {
    export const name: string;
    export const version: string;
}

declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.svg' {
    const value: any;
    export default value;
}

declare module 'custom-event' {
    export = CustomEvent;
}
