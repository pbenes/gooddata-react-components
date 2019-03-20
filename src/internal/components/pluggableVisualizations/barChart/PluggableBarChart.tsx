// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { VisualizationTypes } from "../../../../index";
import cloneDeep = require("lodash/cloneDeep");
import { PluggableColumnBarCharts } from "../PluggableColumnBarCharts";
import {
    COLUMN_BAR_CHART_UICONFIG_WITH_OPTIONAL_STACKING,
    DEFAULT_BAR_CHART_UICONFIG,
} from "../../../constants/uiConfig";
import { IVisConstruct, IUiConfig } from "../../../interfaces/Visualization";
import { BAR_CHART_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import BarChartConfigurationPanel from "../../configurationPanels/BarChartConfigurationPanel";
import { AXIS, AXIS_NAME } from "../../../constants/axis";

export class PluggableBarChart extends PluggableColumnBarCharts {
    constructor(props: IVisConstruct) {
        super(props);
        // set default to DUAL to get the full supported props list
        // and will be updated in getExtendedReferencePoint
        this.axis = AXIS.DUAL;
        this.secondaryAxis = AXIS_NAME.SECONDARY_X;
        this.type = VisualizationTypes.BAR;
        this.supportedPropertiesList = this.getSupportedPropertiesList();
        this.initializeProperties(props.visualizationProperties);
    }

    public getUiConfig(): IUiConfig {
        if (this.isOptionalStackingEnabled()) {
            return cloneDeep(COLUMN_BAR_CHART_UICONFIG_WITH_OPTIONAL_STACKING);
        }

        return cloneDeep(DEFAULT_BAR_CHART_UICONFIG);
    }

    public getSupportedPropertiesList() {
        return BAR_CHART_SUPPORTED_PROPERTIES[this.axis];
    }

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <BarChartConfigurationPanel
                    colors={this.colors}
                    references={this.references}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    mdObject={this.mdObject}
                    intl={this.intl}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.isError}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                    axis={this.axis}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
