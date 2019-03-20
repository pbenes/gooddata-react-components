// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { factory, ApiResponse } from "@gooddata/gooddata-js";
import { shallow } from "enzyme";
import { AFM, VisualizationObject } from "@gooddata/typings";
import "isomorphic-fetch";
import noop = require("lodash/noop");
import { VisualizationGenericDash } from "../VisualizationGenericDash";
import { delay } from "./utils";
import * as testMocks from "../../mocks/testMocks";
import "jest";
import { IDrillableItem } from "../../index";
import { BaseVisualization } from "../BaseVisualization";

const visualizationContent: VisualizationObject.IVisualizationObjectContent = {
    visualizationClass: {
        uri: "",
    },
    buckets: [
        {
            localIdentifier: "measures",
            items: [
                {
                    measure: {
                        localIdentifier: "m1",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/FoodMartDemo/obj/metric.id",
                                },
                            },
                        },
                    },
                },
                {
                    measure: {
                        localIdentifier: "m1_pop",
                        definition: {
                            popMeasureDefinition: {
                                measureIdentifier: "m1",
                                popAttribute: {
                                    uri: "pop_attribute_uri",
                                },
                            },
                        },
                    },
                },
            ],
        },
        {
            localIdentifier: "view",
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: "v1",
                        displayForm: {
                            uri: "/gdc/md/project/obj/1",
                        },
                    },
                },
            ],
        },
    ],
};

const visualizationMdObject: VisualizationObject.IVisualization = {
    visualizationObject: {
        content: visualizationContent,
        meta: {
            author: "rail",
            identifier: "FoodMartDemoViz1",
            isProduction: true,
            title: "FoodMart Visualization 1",
            uri: "/gdc/md/FoodMartDemo/1",
        },
    },
};

const sdkGetSpy = jest.fn(
    (uri: string): Promise<ApiResponse> => {
        if (uri === "/gdc/md/FoodMartDemo/1") {
            const response = new Response();
            const responseBody = JSON.stringify(visualizationMdObject);

            return Promise.resolve(new ApiResponse(response, responseBody));
        }

        return Promise.reject(new Error(`The sdk.xhr.get request for ${uri} is not mocked`));
    },
);

const sdk = factory();

sdk.xhr.get = sdkGetSpy;

describe("VisualizationGenericDash", () => {
    function createComponent(customProps = {}) {
        return shallow(
            <VisualizationGenericDash
                uri="/gdc/md/FoodMartDemo/1"
                sdk={sdk}
                projectId="FoodMartDemo"
                height={200}
                visualizationClass={testMocks.dummyTableVisualizationClass}
                mdObject={testMocks.emptyMdObject}
                locale="en-US"
                pushData={noop}
                {...customProps}
            />,
        );
    }

    it("should call sdk upon creation", () => {
        createComponent();
        expect(sdkGetSpy).toHaveBeenCalledWith("/gdc/md/FoodMartDemo/1");
    });

    it("should create dataSource and resultSpec upon creation", () => {
        const component = createComponent();

        return delay().then(() => {
            expect(component.state("dataSource")).not.toBeNull();
            expect(component.state("resultSpec")).not.toBeNull();
        });
    });

    it("should execute again if attribute filters are added", () => {
        sdkGetSpy.mockClear();
        const attributeFilters: AFM.AttributeFilterItem[] = [
            {
                positiveAttributeFilter: {
                    displayForm: {
                        identifier: "asd",
                    },
                    in: ["asdf"],
                },
            },
        ];

        const component = createComponent();

        return delay().then(() => {
            expect(component.state("dataSource")).not.toBeNull();
            expect(sdkGetSpy).toHaveBeenCalledTimes(1);

            component.setProps({ attributeFilters });

            return delay().then(() => {
                expect(sdkGetSpy).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("rendering", () => {
        it("passes down provided properties", () => {
            const drillableItems: IDrillableItem[] = [];
            const props = {
                visualizationClass: testMocks.dummyTableVisualizationClass,
                mdObject: visualizationContent,
                height: 250,
                stickyHeaderOffset: 20,
                drillableItems,
                featureFlags: {
                    testFlag: true,
                },
                locale: "en-US",
                config: {
                    separators: {
                        thousand: ".", // German number format
                        decimal: ",",
                    },
                },
                onExportReady: () => {
                    noop();
                },
            };
            const component = createComponent(props);

            return delay().then(() => {
                component.update();
                const baseVisualization = component.find(BaseVisualization);
                expect(baseVisualization.props()).toMatchObject(props);
            });
        });
    });
});
