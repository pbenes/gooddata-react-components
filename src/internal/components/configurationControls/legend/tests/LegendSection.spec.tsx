// (C) 2019 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import LegendSection, { ILegendSection } from "../LegendSection";
import LegendPositionControl from "../LegendPositionControl";
import { createInternalIntl } from "../../../../utils/internalIntlProvider";
import noop = require("lodash/noop");
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");
import { IntlProvider } from "react-intl";

const defaultProps: ILegendSection = {
    controlsDisabled: true,
    properties: {},
    propertiesMeta: {},
    intl: createInternalIntl(),
    pushData: noop,
};

function createComponent(customProps: Partial<ILegendSection> = {}) {
    const props: ILegendSection = { ...cloneDeep(defaultProps), ...customProps };
    return mount<ILegendSection, null>(
        <IntlProvider locale="en">
            <LegendSection {...props} />
        </IntlProvider>,
    );
}

describe("LegendSection render", () => {
    it("should render legend section", () => {
        const wrapper = createComponent();
        expect(wrapper.find(LegendSection).length).toBe(1);
    });

    it("when controlsDisabled true than LegendPositionControl should render disabled", () => {
        const notCollapsed = set({}, "legend_section.collapsed", false);
        const legendToggledOn = set({}, "controls.legend.enabled", true);

        const wrapper = createComponent({
            controlsDisabled: true,
            properties: legendToggledOn,
            propertiesMeta: notCollapsed,
        });

        const node = wrapper.find(LegendPositionControl);

        expect(node.length).toBe(1);
        expect(node.find(".gd-button.disabled").length).toBe(1);
    });

    it(
        "When controlsDisabled is false and properties.controls.legend.enabled is false " +
            "than LegendPositionControl should be disabled",
        () => {
            const legendToggledOn = set({}, "controls.legend.enabled", false);
            const notCollapsed = set({}, "legend_section.collapsed", false);

            const wrapper = createComponent({
                controlsDisabled: false,
                properties: legendToggledOn,
                propertiesMeta: notCollapsed,
            });

            const node = wrapper.find(LegendPositionControl);

            expect(node.length).toBe(1);
            expect(node.find(".gd-button.disabled").length).toBe(1);
        },
    );

    it(
        "When controlsDisabled is false and properties.controls.legend.enabled is true " +
            "than LegendPositionControl should be enabled",
        () => {
            const legendToggledOn = set({}, "controls.legend.enabled", true);
            const notCollapsed = set({}, "legend_section.collapsed", false);

            const wrapper = createComponent({
                controlsDisabled: false,
                properties: legendToggledOn,
                propertiesMeta: notCollapsed,
            });

            const node = wrapper.find(LegendPositionControl);
            expect(node.length).toBe(1);
            expect(node.find(".gd-button").hasClass("disabled")).toBe(false);
        },
    );

    it("When legend is not visible in meta and is enabled in properties, legend should be disabled", () => {
        const legendToggledOn = set({}, "controls.legend.enabled", true);
        const propertiesMeta = {
            legend_enabled: false,
            legend_section: { collapsed: false },
        };

        const wrapper = createComponent({
            controlsDisabled: false,
            properties: legendToggledOn,
            propertiesMeta,
        });

        const node = wrapper.find(LegendPositionControl);
        expect(node.length).toBe(1);
        expect(node.find(".gd-button").hasClass("disabled")).toBe(true);
    });
});
