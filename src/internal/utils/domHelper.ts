// (C) 2019 GoodData Corporation
import { unmountComponentAtNode } from "react-dom";

export function unmountComponentsAtNodes(
    elementSelectors: string[] = [],
    {
        unmount,
        doc,
    }: {
        unmount: (element: Element) => void;
        doc: Document;
    } = {
        unmount: unmountComponentAtNode,
        doc: document,
    },
) {
    elementSelectors.forEach(elementSelector => {
        const element = doc.querySelector(elementSelector);
        if (element) {
            unmount(element);
        }
    });
}
