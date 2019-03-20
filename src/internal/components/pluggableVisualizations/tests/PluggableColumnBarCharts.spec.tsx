// (C) 2007-2019 GoodData Corporation
import noop = require("lodash/noop");
import get = require("lodash/get");
import { PluggableColumnChart } from "../columnChart/PluggableColumnChart";
import * as referencePointMocks from "../../../mocks/referencePointMocks";
import { IBucket, IFilters } from "../../../interfaces/Visualization";
import { MAX_VIEW_COUNT } from "../../../constants/uiConfig";
import * as uiConfigMocks from "../../../mocks/uiConfigMocks";
import {
    COLUMN_CHART_SUPPORTED_PROPERTIES,
    OPTIONAL_STACKING_PROPERTIES,
} from "../../../constants/supportedProperties";
import { AXIS } from "../../../constants/axis";

describe("PluggableColumnBarCharts", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
    };

    function createComponent(props = defaultProps) {
        return new PluggableColumnChart(props);
    }

    describe("optional stacking", () => {
        const props = {
            ...defaultProps,
            featureFlags: { enableExtendedStacking: true },
        };

        it("should place third attribute to stack bucket", async () => {
            const columnChart = createComponent(props);
            const mockRefPoint = referencePointMocks.oneMetricAndManyCategoriesReferencePoint;
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: mockRefPoint.buckets[0].items,
                },
                {
                    localIdentifier: "view",
                    items: mockRefPoint.buckets[1].items.slice(0, MAX_VIEW_COUNT),
                },
                {
                    localIdentifier: "stack",
                    items: mockRefPoint.buckets[1].items.slice(MAX_VIEW_COUNT, MAX_VIEW_COUNT + 1),
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: mockRefPoint.filters.items.slice(0, MAX_VIEW_COUNT + 1),
            };
            const extendedReferencePoint = await columnChart.getExtendedReferencePoint(mockRefPoint);

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: uiConfigMocks.oneMetricAndOneStackColumnUiConfig,
            });
        });

        it("should reuse one measure, two categories and one category as stack", async () => {
            const columnChart = createComponent(props);
            const mockRefPoint = referencePointMocks.oneMetricAndManyCategoriesAndOneStackRefPoint;
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: mockRefPoint.buckets[0].items,
                },
                {
                    localIdentifier: "view",
                    items: mockRefPoint.buckets[1].items.slice(0, MAX_VIEW_COUNT),
                },
                {
                    localIdentifier: "stack",
                    items: mockRefPoint.buckets[2].items,
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: mockRefPoint.filters.items,
            };
            const extendedReferencePoint = await columnChart.getExtendedReferencePoint(mockRefPoint);

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: uiConfigMocks.oneMetricAndOneStackColumnUiConfig,
            });
        });

        it("should reuse all measures, two categories and no stack", async () => {
            const columnChart = createComponent(props);
            const mockRefPoint = referencePointMocks.multipleMetricsAndCategoriesReferencePoint;
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: mockRefPoint.buckets[0].items,
                },
                {
                    localIdentifier: "view",
                    items: mockRefPoint.buckets[1].items.slice(0, MAX_VIEW_COUNT),
                },
                {
                    localIdentifier: "stack",
                    items: [],
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: mockRefPoint.filters.items.slice(0, MAX_VIEW_COUNT),
            };
            const extendedReferencePoint = await columnChart.getExtendedReferencePoint(mockRefPoint);

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                uiConfig: uiConfigMocks.multipleMetricsAndCategoriesColumnUiConfig,
                properties: {},
            });
        });

        it("should return reference point without Date in stacks", async () => {
            const columnChart = createComponent(props);
            const mockRefPoint = referencePointMocks.dateAsFirstCategoryReferencePoint;
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: mockRefPoint.buckets[0].items,
                },
                {
                    localIdentifier: "view",
                    items: mockRefPoint.buckets[1].items.slice(0, MAX_VIEW_COUNT),
                },
                {
                    localIdentifier: "stack",
                    items: [],
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };
            const extendedReferencePoint = await columnChart.getExtendedReferencePoint(mockRefPoint);

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: uiConfigMocks.oneMetricAndManyCategoriesColumnUiConfig,
            });
        });

        it("should cut out measures tail when getting many measures, no category and one stack", async () => {
            const columnChart = createComponent(props);
            const mockRefPoint = referencePointMocks.multipleMetricsOneStackByReferencePoint;
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: mockRefPoint.buckets[0].items.slice(0, 1),
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
                {
                    localIdentifier: "stack",
                    items: mockRefPoint.buckets[2].items,
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };
            const extendedReferencePoint = await columnChart.getExtendedReferencePoint(mockRefPoint);

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                uiConfig: uiConfigMocks.oneStackAndNoCategoryColumnUiConfig,
                properties: {},
            });
        });

        it("should update supported properties list base on axis type", async () => {
            const mockProps = {
                ...defaultProps,
                featureFlags: { enableDualAxes: true, enableExtendedStacking: true },
                pushData: jest.fn(),
            };
            const chart = createComponent(mockProps);

            await chart.getExtendedReferencePoint(
                referencePointMocks.oneMetricAndCategoryAndStackReferencePoint,
            );
            expect(get(chart, "supportedPropertiesList")).toEqual([
                ...COLUMN_CHART_SUPPORTED_PROPERTIES[AXIS.PRIMARY],
                ...OPTIONAL_STACKING_PROPERTIES.slice(-1),
            ]);

            await chart.getExtendedReferencePoint(
                referencePointMocks.measuresOnSecondaryAxisAndAttributeReferencePoint,
            );
            expect(get(chart, "supportedPropertiesList")).toEqual([
                ...COLUMN_CHART_SUPPORTED_PROPERTIES[AXIS.SECONDARY],
                ...OPTIONAL_STACKING_PROPERTIES,
            ]);

            await chart.getExtendedReferencePoint(
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
            );
            expect(get(chart, "supportedPropertiesList")).toEqual([
                ...COLUMN_CHART_SUPPORTED_PROPERTIES[AXIS.DUAL],
                ...OPTIONAL_STACKING_PROPERTIES,
            ]);
        });
    });
});
