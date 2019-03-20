// (C) 2007-2019 GoodData Corporation
import get = require("lodash/get");
import has = require("lodash/has");
import set = require("lodash/set");
import keys = require("lodash/keys");
import isEmpty = require("lodash/isEmpty");
import cloneDeep = require("lodash/cloneDeep");
import {
    IExtendedReferencePoint,
    IFeatureFlags,
    IVisualizationProperties,
} from "../interfaces/Visualization";
import { BucketNames } from "../../index";
import { AXIS } from "../constants/axis";
import { getItemsCount, getPreferredBucketItems } from "./bucketHelper";
import { BUCKETS, METRIC } from "../constants/bucket";
import { PROPERTY_CONTROLS } from "../constants/properties";
import { UICONFIG_AXIS } from "../constants/uiConfig";
import { AxisType } from "../interfaces/AxisType";
import { OPTIONAL_STACKING_PROPERTIES } from "../constants/supportedProperties";

export function getSupportedPropertiesControls(
    visualizationControlsProperties: any,
    supportedPropertiesList: string[],
) {
    const clonedControls = cloneDeep(visualizationControlsProperties);
    if (supportedPropertiesList) {
        return supportedPropertiesList.reduce(
            (props: IVisualizationProperties, current: string) =>
                has(clonedControls, current) ? set(props, current, get(clonedControls, current)) : props,
            {},
        );
    }
    return {};
}

export function hasColorMapping(properties: IVisualizationProperties) {
    return !!get(properties, ["controls", "colorMapping"]);
}

export function setSecondaryMeasures(
    referencePoint: IExtendedReferencePoint,
    axisName: AxisType,
    featureFlags: IFeatureFlags,
) {
    const isEnableDualAxes = get(featureFlags, "enableDualAxes");

    if (!isEnableDualAxes || !axisName) {
        return referencePoint;
    }

    const newReferencePoint = cloneDeep(referencePoint);
    const path = `${PROPERTY_CONTROLS}.${axisName}`;
    const secondaryAxisProperties = get(newReferencePoint, path);
    const buckets = get(newReferencePoint, BUCKETS, []);
    const measuresBucketItems = getPreferredBucketItems(buckets, [BucketNames.MEASURES], [METRIC]);
    const secondaryMeasures = measuresBucketItems.reduce((measures: string[], item: any) => {
        if (get(item, "showOnSecondaryAxis")) {
            measures.push(get(item, "localIdentifier"));
        }
        return measures;
    }, []);

    if (!secondaryAxisProperties && !secondaryMeasures.length) {
        return referencePoint;
    }

    const secondaryAxis = {
        ...secondaryAxisProperties,
        measures: secondaryMeasures,
    };
    const axis: string =
        {
            0: AXIS.PRIMARY,
            [measuresBucketItems.length]: AXIS.SECONDARY,
        }[secondaryMeasures.length] || AXIS.DUAL;

    set(newReferencePoint, path, secondaryAxis);
    set(newReferencePoint, UICONFIG_AXIS, axis);

    return newReferencePoint;
}

export function isEmptyObject(obj: object) {
    return obj && keys(obj).length === 0;
}

export function getSupportedProperties(
    visualizationProperties: IVisualizationProperties,
    supportedPropertiesList: string[],
): IVisualizationProperties {
    const controls = get(visualizationProperties, "properties.controls", {});
    const supportedControls = getSupportedPropertiesControls(controls, supportedPropertiesList);

    return isEmpty(supportedControls)
        ? {}
        : {
              controls: supportedControls,
          };
}

export function getReferencePointWithSupportedProperties(
    referencePoint: IExtendedReferencePoint,
    supportedPropertiesList: string[],
): IExtendedReferencePoint {
    const supportedControlsProperties = referencePoint.properties
        ? getSupportedPropertiesControls(referencePoint.properties.controls, supportedPropertiesList)
        : {};

    if (isEmpty(supportedControlsProperties)) {
        const sortItems = referencePoint.properties && referencePoint.properties.sortItems;
        const sortItemsExpand = sortItems && !isEmpty(sortItems) ? { sortItems } : {};

        return {
            ...referencePoint,
            properties: {
                ...sortItemsExpand,
            },
        };
    }

    return {
        ...referencePoint,
        properties: {
            ...referencePoint.properties,
            controls: supportedControlsProperties,
        },
    };
}

export function isStackingMeasure(properties: IVisualizationProperties) {
    return get(properties, ["controls", "stackMeasures"], false);
}

export function isStackingToPercent(properties: IVisualizationProperties) {
    return get(properties, ["controls", "stackMeasuresToPercent"], false);
}

export function getStackingProperties(referencePoint: IExtendedReferencePoint) {
    const buckets = get(referencePoint, BUCKETS, []);

    if (getItemsCount(buckets, BucketNames.MEASURES) > 1) {
        return OPTIONAL_STACKING_PROPERTIES;
    }

    if (getItemsCount(buckets, BucketNames.STACK)) {
        return OPTIONAL_STACKING_PROPERTIES.slice(-1);
    }

    return [];
}
