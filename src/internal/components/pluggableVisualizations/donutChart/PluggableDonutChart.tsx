// (C) 2007-2019 GoodData Corporation
import { VisualizationTypes } from "../../../../index";
import { IVisConstruct, IReferencePoint, IExtendedReferencePoint } from "../../../interfaces/Visualization";

import { PluggablePieChart } from "../pieChart/PluggablePieChart";
import { setDonutChartUiConfig } from "../../../utils/uiConfigHelpers/donutChartUiConfigHelper";

export class PluggableDonutChart extends PluggablePieChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.DONUT;
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super.getExtendedReferencePoint(referencePoint).then(setDonutChartUiConfig);
    }
}
