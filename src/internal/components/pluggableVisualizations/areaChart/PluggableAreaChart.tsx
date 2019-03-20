// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import set = require("lodash/set");
import { render } from "react-dom";
import { VisualizationTypes, BucketNames } from "../../../../index";
import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";

import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisConstruct,
    IBucketItem,
} from "../../../interfaces/Visualization";
import { DEFAULT_AREA_UICONFIG } from "../../../constants/uiConfig";

import { BUCKETS } from "../../../constants/bucket";

import {
    sanitizeUnusedFilters,
    getMeasureItems,
    getAttributeItemsWithoutStacks,
    getStackItems,
    getDateItems,
    getAllAttributeItemsWithPreference,
    isDate,
    removeAllDerivedMeasures,
    removeAllArithmeticMeasuresFromDerived,
    getFilteredMeasuresForStackedCharts,
} from "../../../utils/bucketHelper";

import { setAreaChartUiConfig } from "../../../utils/uiConfigHelpers/areaChartUiConfigHelper";
import { removeSort } from "../../../utils/sort";
import LineChartBasedConfigurationPanel from "../../configurationPanels/LineChartBasedConfigurationPanel";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";

export class PluggableAreaChart extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.AREA;
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(DEFAULT_AREA_UICONFIG),
        };
        newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
        newReferencePoint = removeAllDerivedMeasures(newReferencePoint);

        const buckets = get(clonedReferencePoint, BUCKETS, []);
        const measures = getMeasureItems(buckets);
        let attributes: IBucketItem[] = [];
        let stacks: IBucketItem[] = getStackItems(buckets);
        const dateItems = getDateItems(buckets);
        const allAttributes = getAllAttributeItemsWithPreference(buckets, [
            BucketNames.TREND,
            BucketNames.VIEW,
            BucketNames.SEGMENT,
            BucketNames.STACK,
        ]);

        if (dateItems.length) {
            attributes = dateItems.slice(0, 1);
            if (measures.length <= 1 && allAttributes.length > 1) {
                stacks = allAttributes.filter((attribute: IBucketItem) => !isDate(attribute)).slice(0, 1);
            }
        } else {
            if (measures.length <= 1 && allAttributes.length > 1) {
                stacks = allAttributes.slice(1, 2);
            }

            attributes = getAttributeItemsWithoutStacks(buckets).slice(0, 1);
        }

        set(newReferencePoint, BUCKETS, [
            {
                localIdentifier: BucketNames.MEASURES,
                items: getFilteredMeasuresForStackedCharts(buckets),
            },
            {
                localIdentifier: BucketNames.VIEW,
                items: attributes,
            },
            {
                localIdentifier: BucketNames.STACK,
                items: stacks,
            },
        ]);

        newReferencePoint = setAreaChartUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = configurePercent(newReferencePoint, false);
        newReferencePoint = configureOverTimeComparison(newReferencePoint);
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeUnusedFilters(newReferencePoint, clonedReferencePoint));
    }

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <LineChartBasedConfigurationPanel
                    colors={this.colors}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    mdObject={this.mdObject}
                    references={this.references}
                    intl={this.intl}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.isError}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
