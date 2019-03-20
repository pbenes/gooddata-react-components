// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");
import assign = require("lodash/assign");
import { BucketNames } from "../../../index";

import { IExtendedReferencePoint } from "../../interfaces/Visualization";

import { disabledOpenAsReportConfig, UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";

import * as funnelMeasuresIcon from "../../assets/funnel/bucket-title-measures.svg";
import * as funnelViewIcon from "../../assets/funnel/bucket-title-view.svg";

export function setFunnelChartUiConfig(referencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);

    assign(referencePointConfigured[UICONFIG], disabledOpenAsReportConfig);

    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], funnelMeasuresIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], funnelViewIcon);

    return referencePointConfigured;
}
