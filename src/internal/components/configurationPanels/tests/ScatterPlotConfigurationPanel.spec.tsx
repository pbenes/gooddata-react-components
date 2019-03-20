// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import ScatterPlotConfigurationPanel from "../ScatterPlotConfigurationPanel";
import { IConfigurationPanelContentProps } from "../ConfigurationPanelContent";
import ConfigSection from "../../configurationControls/ConfigSection";

describe("ScatterPlotConfigurationPanel", () => {
    function createComponent(props: IConfigurationPanelContentProps = {}) {
        return shallow<IConfigurationPanelContentProps, null>(<ScatterPlotConfigurationPanel {...props} />, {
            lifecycleExperimental: true,
        });
    }

    it("should render three sections in configuration panel for bubble chart", () => {
        const wrapper = createComponent({});

        expect(wrapper.find(ConfigSection).length).toBe(3);
    });
});
