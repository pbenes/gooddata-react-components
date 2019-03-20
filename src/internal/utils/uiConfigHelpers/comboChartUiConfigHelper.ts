// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");
import { BucketNames } from "../../../index";
import { InjectedIntl } from "react-intl";

import { IExtendedReferencePoint, IUiConfig } from "../../interfaces/Visualization";

import { UICONFIG, measuresBase, viewBase, defaultFilters } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";

import { setBucketTitles } from "../bucketHelper";

export const DEFAULT_COMBO_CHART_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        secondary_measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
            itemsLimit: 1,
        },
        ...defaultFilters,
    },
    recommendations: {},
    supportedOverTimeComparisonTypes: [],
};

import * as comboMeasuresIcon from "../../assets/combo/bucket-title-measures.svg";
import * as comboSecondaryMeasuresIcon from "../../assets/combo/bucket-title-secondary-measures.svg";
import * as comboViewIcon from "../../assets/combo/bucket-title-view.svg";

export function setComboChartUiConfig(
    referencePoint: IExtendedReferencePoint,
    intl: InjectedIntl,
    visualizationType: string,
): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);

    set(referencePointConfigured, UICONFIG, setBucketTitles(referencePoint, visualizationType, intl));
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "canAddItems"], true);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.SECONDARY_MEASURES, "canAddItems"], true);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "canAddItems"], true);

    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], comboMeasuresIcon);
    set(
        referencePointConfigured,
        [UICONFIG, BUCKETS, BucketNames.SECONDARY_MEASURES, "icon"],
        comboSecondaryMeasuresIcon,
    );
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], comboViewIcon);

    return referencePointConfigured;
}
