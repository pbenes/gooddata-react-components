// (C) 2007-2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import { getVisualizationOptions } from "../visualizationDateFilterOptions";

describe("getVisualizationOptions", () => {
    function createAfm(measures: AFM.IMeasure[]): AFM.IAfm {
        return { measures };
    }

    function createDateFilter(): AFM.IRelativeDateFilter {
        return {
            relativeDateFilter: {
                dataSet: { identifier: "foo" },
                from: -1,
                to: -1,
                granularity: "GDC.time.year",
            },
        };
    }

    function createAttributeFilter(): AFM.IPositiveAttributeFilter {
        return {
            positiveAttributeFilter: {
                displayForm: { identifier: "foo" },
                in: [],
            },
        };
    }

    function createMeasure(filters: AFM.FilterItem[]): AFM.IMeasure {
        return {
            localIdentifier: "foo",
            definition: {
                measure: {
                    item: { identifier: "bar" },
                    filters,
                },
            },
        };
    }

    function createSPDerivedMeasure(): AFM.IMeasure {
        return {
            localIdentifier: "popFoo",
            definition: {
                popMeasure: {
                    measureIdentifier: "foo",
                    popAttribute: { uri: "abc" },
                },
            },
        };
    }

    function createPPDerivedMeasure(): AFM.IMeasure {
        return {
            localIdentifier: "popFoo",
            definition: {
                previousPeriodMeasure: {
                    measureIdentifier: "foo",
                    dateDataSets: [],
                },
            },
        };
    }

    function createArithmeticMeasure(): AFM.IMeasure {
        return {
            localIdentifier: "amFoo",
            definition: {
                arithmeticMeasure: {
                    measureIdentifiers: ["foo", "foo"],
                    operator: "sum",
                },
            },
        };
    }

    describe("dateOptionsDisabled", () => {
        it("should be true if all measures use date filter", () => {
            const afm = createAfm([createMeasure([createDateFilter()]), createMeasure([createDateFilter()])]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", true);
        });

        it("should be true if all measures use date filter and also attribute filter", () => {
            const afm = createAfm([
                createMeasure([createDateFilter(), createAttributeFilter()]),
                createMeasure([createDateFilter()]),
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", true);
        });

        it("should be false if all measures use attribute filter only", () => {
            const afm = createAfm([
                createMeasure([createAttributeFilter()]),
                createMeasure([createAttributeFilter()]),
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should not be influenced by SP derived measure", () => {
            const afm1 = createAfm([createMeasure([createDateFilter()]), createSPDerivedMeasure()]);
            expect(getVisualizationOptions(afm1)).toHaveProperty("dateOptionsDisabled", true);

            const afm2 = createAfm([createMeasure([]), createSPDerivedMeasure()]);
            expect(getVisualizationOptions(afm2)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should not be influenced by PP derived measure measure", () => {
            const afm1 = createAfm([createMeasure([createDateFilter()]), createSPDerivedMeasure()]);
            expect(getVisualizationOptions(afm1)).toHaveProperty("dateOptionsDisabled", true);

            const afm2 = createAfm([createMeasure([]), createPPDerivedMeasure()]);
            expect(getVisualizationOptions(afm2)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should not be influenced by arithmetic measure", () => {
            const afm1 = createAfm([createMeasure([createDateFilter()]), createArithmeticMeasure()]);
            expect(getVisualizationOptions(afm1)).toHaveProperty("dateOptionsDisabled", true);

            const afm2 = createAfm([createMeasure([]), createArithmeticMeasure()]);
            expect(getVisualizationOptions(afm2)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should be false if some measures use attribute filter and some date filter", () => {
            const afm = createAfm([
                createMeasure([createAttributeFilter()]),
                createMeasure([createDateFilter()]),
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should be false if some measure use date filter, but some does not use any filter", () => {
            const afm = createAfm([createMeasure([createDateFilter()]), createMeasure([])]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should be false if there are no measures", () => {
            const afm = createAfm([]);
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", false);
        });

        it("should be false if AFM is empty object", () => {
            const afm = {};
            expect(getVisualizationOptions(afm)).toHaveProperty("dateOptionsDisabled", false);
        });
    });
});
