// (C) 2007-2019 GoodData Corporation
import noop = require("lodash/noop");

import { IBucket, IFilters } from "../../../../interfaces/Visualization";
import { PluggableAreaChart } from "../PluggableAreaChart";

import * as testMocks from "../../../../mocks/testMocks";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";

jest.mock("react-dom", () => {
    const renderObject = {
        render: () => {
            return;
        },
    };

    return {
        render: renderObject.render,
        unmountComponentAtNode: () => {
            return;
        },
        renderObject,
    };
});

describe("PluggableAreaChart", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
            onError: noop,
            onLoadingChanged: noop,
        },
        dataSource: testMocks.dummyDataSource,
    };

    function createComponent(props = defaultProps) {
        return new PluggableAreaChart(props);
    }

    afterAll(() => {
        document.clear();
    });

    it("should reuse one measure, only one category and one category as stack", async () => {
        const areaChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.oneMetricAndManyCategoriesReferencePoint.buckets[0].items,
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.oneMetricAndManyCategoriesReferencePoint.buckets[1].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "stack",
                items: referencePointMocks.oneMetricAndManyCategoriesReferencePoint.buckets[1].items.slice(
                    1,
                    2,
                ),
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.oneMetricAndManyCategoriesReferencePoint.filters.items.slice(0, 2),
        };

        const extendedReferencePoint = await areaChart.getExtendedReferencePoint(
            referencePointMocks.oneMetricAndManyCategoriesReferencePoint,
        );
        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.oneMetricAndManyCategoriesAreaUiConfig,
            properties: {},
        });
    });

    it("should reuse all measures, only one category and no stacks", async () => {
        const areaChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items,
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[1].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "stack",
                items: [],
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.filters.items.slice(0, 1),
        };

        const extendedReferencePoint = await areaChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
        );
        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.multipleMetricsAndCategoriesAreaUiConfig,
            properties: {},
        });
    });

    it("should return reference point with Date in categories even it was as second item", async () => {
        const areaChart = createComponent();
        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.dateAsSecondCategoryReferencePointWithoutStack.buckets[0].items,
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.dateAsSecondCategoryReferencePointWithoutStack.buckets[1].items.slice(
                    0,
                    1,
                ),
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

        const extendedReferencePoint = await areaChart.getExtendedReferencePoint(
            referencePointMocks.dateAsSecondCategoryReferencePointWithoutStack,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.dateAsSecondCategoryAreaUiConfig,
            properties: {},
        });
    });

    it("should return reference point when no categories and only stacks", async () => {
        const areaChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.oneStackAndNoCategoriesReferencePoint.buckets[0].items,
            },
            {
                localIdentifier: "view",
                items: [],
            },
            {
                localIdentifier: "stack",
                items: referencePointMocks.oneStackAndNoCategoriesReferencePoint.buckets[2].items.slice(0, 1),
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        const extendedReferencePoint = await areaChart.getExtendedReferencePoint(
            referencePointMocks.oneStackAndNoCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.oneStackAndNoCategoriesAreaUiConfig,
            properties: {},
        });
    });

    it("should cut out measures tail when getting nM 0Vb 1Sb", async () => {
        const baseChart = createComponent();
        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsOneStackByReferencePoint.buckets[0].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "view",
                items: [],
            },
            {
                localIdentifier: "stack",
                items: referencePointMocks.multipleMetricsOneStackByReferencePoint.buckets[2].items,
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };
        const expectedProperties = {};

        const extendedReferencePoint = await baseChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsOneStackByReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.oneMetricAndManyCategoriesAreaUiConfig,
            properties: expectedProperties,
        });
    });

    it("should allow only one date attribute", async () => {
        const areaChart = createComponent();
        const referencePoint = referencePointMocks.dateAttributeOnRowAndColumnReferencePoint;
        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [referencePoint.buckets[0].items[0]],
            },
            {
                localIdentifier: "view",
                items: [referencePoint.buckets[1].items[0]],
            },
            {
                localIdentifier: "stack",
                items: [],
            },
        ];

        const extendedReferencePoint = await areaChart.getExtendedReferencePoint(
            referencePointMocks.dateAttributeOnRowAndColumnReferencePoint,
        );

        expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
    });

    describe("Over Time Comparison", () => {
        it("should return reference point containing uiConfig with no supported comparison types", async () => {
            const component = createComponent();

            const extendedReferencePoint = await component.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );

            expect(extendedReferencePoint.uiConfig.supportedOverTimeComparisonTypes).toEqual([]);
        });

        it("should remove all derived measures and arithmetic measures created from derived measures", async () => {
            const component = createComponent();

            const extendedReferencePoint = await component.getExtendedReferencePoint(
                referencePointMocks.mixOfMeasuresWithDerivedAndArithmeticFromDerivedAreaReferencePoint,
            );
            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        referencePointMocks.masterMeasureItems[0],
                        referencePointMocks.masterMeasureItems[1],
                        referencePointMocks.arithmeticMeasureItems[0],
                        referencePointMocks.arithmeticMeasureItems[1],
                    ],
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
                {
                    localIdentifier: "stack",
                    items: [],
                },
            ]);
        });
    });
});
