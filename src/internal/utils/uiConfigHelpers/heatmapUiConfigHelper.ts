// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");
import { InjectedIntl } from "react-intl";
import { BucketNames } from "../../../index";

import { IExtendedReferencePoint } from "../../interfaces/Visualization";

import { UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";

import { setBucketTitles } from "../bucketHelper";

import * as heatmapMeasuresIcon from "../../assets/heatmap/bucket-title-measures.svg";
import * as heatmapViewIcon from "../../assets/heatmap/bucket-title-view.svg";
import * as heatmapStackIcon from "../../assets/heatmap/bucket-title-stack.svg";

export function setHeatmapUiConfig(
    referencePoint: IExtendedReferencePoint,
    intl: InjectedIntl,
    visualizationType: string,
): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);

    set(referencePointConfigured, [UICONFIG], setBucketTitles(referencePoint, visualizationType, intl));

    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], heatmapMeasuresIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], heatmapViewIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.STACK, "icon"], heatmapStackIcon);

    return referencePointConfigured;
}
