// (C) 2007-2019 GoodData Corporation
import { IExtendedReferencePoint, IReferencePoint } from "../../interfaces/Visualization";
import {
    getSupportedPropertiesControls,
    getSupportedProperties,
    getReferencePointWithSupportedProperties,
    getStackingProperties,
} from "../propertiesHelper";
import {
    emptyReferencePoint,
    simpleStackedReferencePoint,
    multipleMetricsOneStackByReferencePoint,
} from "../../mocks/referencePointMocks";
import { simpleStackedBaseUiConfig } from "../../mocks/uiConfigMocks";
import { OPTIONAL_STACKING_PROPERTIES } from "../../constants/supportedProperties";

describe("propertiesHelper", () => {
    describe("getSupportedPropertiesControls", () => {
        const defaultControls = {
            propA: {
                foo: "bar",
                bar: "foo",
            },
            propB: {
                foo: "bar",
            },
            foo: "bar",
        };

        it("should return empty object if no supported properties list is defined", () => {
            expect(getSupportedPropertiesControls(null, null)).toEqual({});
        });

        it("should return empty object when supported properties list is empty", () => {
            expect(getSupportedPropertiesControls(defaultControls, [])).toEqual({});
        });

        it("should return every property if highest level is defined", () => {
            const supportedPropertiesList = ["propA", "propB", "foo"];

            expect(getSupportedPropertiesControls(defaultControls, supportedPropertiesList)).toEqual(
                defaultControls,
            );
        });

        it("should return only properties parts which are defined in supported properties list", () => {
            const supportedPropertiesList = ["propA.foo", "foo"];

            const expectedSupportedProperties = {
                propA: {
                    foo: "bar",
                },
                foo: "bar",
            };

            expect(getSupportedPropertiesControls(defaultControls, supportedPropertiesList)).toEqual(
                expectedSupportedProperties,
            );
        });
    });

    describe("getSupportedProperties", () => {
        it("should return empty object when properties are null", () => {
            const result = getSupportedProperties(null, []);
            expect(result).toEqual({});
        });

        it("should return empty object when properties do not have controls", () => {
            const result = getSupportedProperties({}, []);
            expect(result).toEqual({});
        });

        it("should return object with only supported controls", () => {
            const properties = {
                properties: {
                    controls: {
                        supported: "abc",
                        unsupported: "xyz",
                    },
                },
            };
            const supported = ["supported"];

            const expected = {
                controls: {
                    supported: "abc",
                },
            };

            const result = getSupportedProperties(properties, supported);

            expect(result).toEqual(expected);
        });
    });

    describe("getReferencePointWithSupportedProperties", () => {
        it("should return reference point with pith properties with only sort items", () => {
            const referencePoint = {
                ...emptyReferencePoint,
                uiConfig: simpleStackedBaseUiConfig,
                properties: {
                    sortItems: ["sortItem"],
                    controls: {},
                },
            };
            const expected = {
                ...emptyReferencePoint,
                uiConfig: simpleStackedBaseUiConfig,
                properties: {
                    sortItems: ["sortItem"],
                },
            };

            const result = getReferencePointWithSupportedProperties(referencePoint, []);

            expect(result).toEqual(expected);
        });

        it("should return properties with controls", () => {
            const referencePoint = {
                ...emptyReferencePoint,
                uiConfig: simpleStackedBaseUiConfig,
                properties: {
                    controls: {
                        testProperty: "value",
                    },
                },
            };
            const expected = referencePoint;

            const result = getReferencePointWithSupportedProperties(referencePoint, ["testProperty"]);

            expect(result).toEqual(expected);
        });
    });

    describe("getStackingProperties", () => {
        it.each([
            [
                "full supported stacking properties",
                multipleMetricsOneStackByReferencePoint,
                OPTIONAL_STACKING_PROPERTIES,
            ],
            ['"stack to percent" property', simpleStackedReferencePoint, ["stackMeasuresToPercent"]],
            ["empty supported properties list", emptyReferencePoint, []],
        ])("should return %s", (_name: string, refPoint: IReferencePoint, expectedProps) => {
            const extendedRefPoint: IExtendedReferencePoint = {
                ...refPoint,
                uiConfig: simpleStackedBaseUiConfig,
            };

            expect(getStackingProperties(extendedRefPoint)).toEqual(expectedProps);
        });
    });
});
