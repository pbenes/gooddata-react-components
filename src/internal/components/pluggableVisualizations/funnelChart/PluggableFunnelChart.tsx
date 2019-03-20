// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import get = require("lodash/get");
import { VisualizationTypes } from "../../../../index";
import {
    IVisConstruct,
    IReferencePoint,
    IExtendedReferencePoint,
    IVisualizationProperties,
} from "../../../interfaces/Visualization";

import { PluggablePieChart } from "../pieChart/PluggablePieChart";
import { setFunnelChartUiConfig } from "../../../utils/uiConfigHelpers/funnelChartUiConfigHelper";
import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";

export class PluggableFunnelChart extends PluggablePieChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.FUNNEL;
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super.getExtendedReferencePoint(referencePoint).then(setFunnelChartUiConfig);
    }

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            const properties: IVisualizationProperties = get(
                this.visualizationProperties,
                "properties",
                {},
            ) as IVisualizationProperties;

            render(
                <UnsupportedConfigurationPanel
                    intl={this.intl}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
