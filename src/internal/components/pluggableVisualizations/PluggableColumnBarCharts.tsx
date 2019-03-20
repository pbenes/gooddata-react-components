// (C) 2007-2019 GoodData Corporation
import get = require("lodash/get");
import { BucketNames } from "../../index";
import { PluggableBaseChart } from "./baseChart/PluggableBaseChart";
import { AXIS } from "../../constants/axis";
import {
    IBucket,
    IBucketItem,
    IExtendedReferencePoint,
    IReferencePoint,
} from "../../interfaces/Visualization";
import {
    getAllAttributeItemsWithPreference,
    getFilteredMeasuresForStackedCharts,
    getStackItems,
    isDate,
} from "../../utils/bucketHelper";
import { MAX_STACKS_COUNT, MAX_VIEW_COUNT, UICONFIG_AXIS } from "../../constants/uiConfig";
import {
    getReferencePointWithSupportedProperties,
    getStackingProperties,
    setSecondaryMeasures,
} from "../../utils/propertiesHelper";
import { setColumnBarChartUiConfig } from "../../utils/uiConfigHelpers/columnBarChartUiConfigHelper";

export class PluggableColumnBarCharts extends PluggableBaseChart {
    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super.getExtendedReferencePoint(referencePoint).then((ext: IExtendedReferencePoint) => {
            const isOptionalStackingEnabled = this.isOptionalStackingEnabled();
            const customProperties = isOptionalStackingEnabled ? getStackingProperties(ext) : [];
            let newExt = setSecondaryMeasures(ext, this.secondaryAxis, this.featureFlags);

            this.axis = get(newExt, UICONFIG_AXIS, AXIS.PRIMARY);
            this.supportedPropertiesList = [...this.getSupportedPropertiesList(), ...customProperties];

            newExt = getReferencePointWithSupportedProperties(newExt, this.supportedPropertiesList);
            return setColumnBarChartUiConfig(newExt, this.intl, isOptionalStackingEnabled);
        });
    }

    protected getStackItems(buckets: IBucket[]): IBucketItem[] {
        if (this.isOptionalStackingEnabled()) {
            const measures = getFilteredMeasuresForStackedCharts(buckets);
            const allAttributes = getAllAttributeItemsWithPreference(buckets, [
                BucketNames.VIEW,
                BucketNames.TREND,
                BucketNames.STACK,
                BucketNames.SEGMENT,
            ]);
            const stacks = getStackItems(buckets)
                .filter(attribute => !isDate(attribute)) // getStackItems already filters out Date
                .slice(0, MAX_STACKS_COUNT);

            if (!stacks.length && measures.length <= 1 && allAttributes.length > MAX_VIEW_COUNT) {
                return allAttributes
                    .slice(MAX_VIEW_COUNT, allAttributes.length)
                    .filter(attribute => !isDate(attribute))
                    .slice(0, MAX_STACKS_COUNT);
            }

            return stacks;
        }

        return super.getStackItems(buckets);
    }
}
