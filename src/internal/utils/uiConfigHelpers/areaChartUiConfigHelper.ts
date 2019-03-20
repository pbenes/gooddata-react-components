// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import set = require("lodash/set");
import forEach = require("lodash/forEach");
import { BucketNames } from "../../../index";
import { InjectedIntl } from "react-intl";

import { IExtendedReferencePoint, IBucket, IUiConfig, IBucketUiConfig } from "../../interfaces/Visualization";

import { UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";

import { hasNoStacks, hasNoMeasures, hasMoreThanOneMasterMeasure } from "./../bucketRules";

import { setBucketTitles } from "./../bucketHelper";

import * as areaMeasuresIcon from "../../assets/area/bucket-title-measures.svg";
import * as areaViewIcon from "../../assets/area/bucket-title-view.svg";
import * as areaStackIcon from "../../assets/area/bucket-title-stack.svg";

function setAreaChartBucketWarningMessages(referencePoint: IExtendedReferencePoint, intl?: InjectedIntl) {
    const buckets: IBucket[] = get(referencePoint, BUCKETS);
    const updatedUiConfig: IUiConfig = cloneDeep(get(referencePoint, UICONFIG));

    forEach(buckets, (bucket: IBucket) => {
        const localIdentifier: string = get(bucket, "localIdentifier", "");
        const bucketUiConfig: IBucketUiConfig = get(updatedUiConfig, [BUCKETS, localIdentifier]);

        // skip disabled buckets
        if (!get(bucketUiConfig, "enabled", false)) {
            return;
        }

        if (!get(bucketUiConfig, "canAddItems")) {
            let warningMessageId;
            if (bucket.localIdentifier === BucketNames.MEASURES) {
                warningMessageId = "dashboard.bucket.metric_stack_by_warning";
            } else if (bucket.localIdentifier === BucketNames.STACK) {
                warningMessageId = "dashboard.bucket.category_stack_by_warning";
            }

            if (warningMessageId) {
                const warningMessage = intl ? intl.formatMessage({ id: warningMessageId }) : warningMessageId;
                set(updatedUiConfig, [BUCKETS, localIdentifier, "warningMessage"], warningMessage);
            }
        }
    });

    return updatedUiConfig;
}

export function setAreaChartUiConfig(
    referencePoint: IExtendedReferencePoint,
    intl: InjectedIntl,
    visualizationType: string,
): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);
    const buckets: IBucket[] = get(referencePointConfigured, BUCKETS, []);

    const measuresCanAddItems = hasNoMeasures(buckets) || hasNoStacks(buckets);
    const stackCanAddItems = !hasMoreThanOneMasterMeasure(buckets, BucketNames.MEASURES);

    set(referencePointConfigured, UICONFIG, setBucketTitles(referencePoint, visualizationType, intl));
    set(
        referencePointConfigured,
        [UICONFIG, BUCKETS, BucketNames.MEASURES, "canAddItems"],
        measuresCanAddItems,
    );
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "canAddItems"], true);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.STACK, "canAddItems"], stackCanAddItems);
    set(
        referencePointConfigured,
        UICONFIG,
        setAreaChartBucketWarningMessages(referencePointConfigured, intl),
    );

    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], areaMeasuresIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], areaViewIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.STACK, "icon"], areaStackIcon);

    return referencePointConfigured;
}
