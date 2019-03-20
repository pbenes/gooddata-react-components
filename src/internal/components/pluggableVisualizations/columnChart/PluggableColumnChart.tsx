// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import { PluggableColumnBarCharts } from "../PluggableColumnBarCharts";
import { AXIS, AXIS_NAME } from "../../../constants/axis";
import { COLUMN_CHART_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import {
    COLUMN_BAR_CHART_UICONFIG_WITH_OPTIONAL_STACKING,
    DEFAULT_COLUMN_CHART_UICONFIG,
} from "../../../constants/uiConfig";
import { VisualizationTypes } from "../../../../index";
import { IVisConstruct, IUiConfig } from "../../../interfaces/Visualization";

export class PluggableColumnChart extends PluggableColumnBarCharts {
    constructor(props: IVisConstruct) {
        super(props);
        // set default to DUAL to get the full supported props list
        // and will be updated in getExtendedReferencePoint
        this.axis = AXIS.DUAL;
        this.secondaryAxis = AXIS_NAME.SECONDARY_Y;
        this.type = VisualizationTypes.COLUMN;
        this.supportedPropertiesList = this.getSupportedPropertiesList();
        this.initializeProperties(props.visualizationProperties);
    }

    public getUiConfig(): IUiConfig {
        if (this.isOptionalStackingEnabled()) {
            return cloneDeep(COLUMN_BAR_CHART_UICONFIG_WITH_OPTIONAL_STACKING);
        }

        return cloneDeep(DEFAULT_COLUMN_CHART_UICONFIG);
    }

    public getSupportedPropertiesList() {
        return COLUMN_CHART_SUPPORTED_PROPERTIES[this.axis];
    }
}
