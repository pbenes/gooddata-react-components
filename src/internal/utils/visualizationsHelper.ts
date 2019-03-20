// (C) 2007-2019 GoodData Corporation
import includes = require("lodash/includes");
import { VisualizationTypes, ChartType } from "../../index";

const openAsReportSupportingVisualizations: ChartType[] = [
    VisualizationTypes.COLUMN,
    VisualizationTypes.BAR,
    VisualizationTypes.LINE,
    VisualizationTypes.PIE,
];

export function isOpenAsReportSupportedByVisualization(type: ChartType) {
    return includes(openAsReportSupportingVisualizations, type);
}
