// (C) 2007-2019 GoodData Corporation

import some = require("lodash/some");
import isEmpty = require("lodash/isEmpty");
import { AFM } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";

export interface IVisualizationOptions {
    dateOptionsDisabled: boolean;
}

function isDateFilteredMeasure(measure: AFM.IMeasure) {
    if (DataLayer.AfmUtils.isSimpleMeasure(measure)) {
        const filters = DataLayer.AfmUtils.unwrapSimpleMeasure(measure).filters;
        return some<AFM.FilterItem>(filters, filter => DataLayer.AfmUtils.isDateFilter(filter));
    }
    return true;
}

export function getVisualizationOptions(afm: AFM.IAfm): IVisualizationOptions {
    const dateOptionsDisabled = isEmpty(afm.measures) ? false : afm.measures.every(isDateFilteredMeasure);

    return {
        dateOptionsDisabled,
    };
}
