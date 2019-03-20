// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import { DataLayer, factory } from "@gooddata/gooddata-js";
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { IDrillableItem } from "../../index";
import {
    VisualizationGenericADPure,
    INVALID_BUCKETS_RESPONSE,
    IVisualizationGenericADProps,
    IVisualizationGenericADState,
    createDataSource,
    EMPTY_AFM_RESPONSE,
    visualisationHasInvalidBuckets,
} from "../VisualizationGenericAD";
import { delay } from "./utils";
import * as testMocks from "../../mocks/testMocks";
import { visualizationObjectMock } from "../../mocks/visualizationObjectMocks";
import { BaseVisualization } from "../BaseVisualization";
import * as referencePointMocks from "../../mocks/referencePointMocks";
import { SECONDARY_MEASURES } from "../../index";
import noop = require("lodash/noop");
import set = require("lodash/set");
import cloneDeep = require("lodash/cloneDeep");

describe("VisualizationGenericADPure", () => {
    const executableMdObject: VisualizationObject.IVisualizationObjectContent = {
        visualizationClass: {
            uri: "",
        },
        buckets: [
            {
                localIdentifier: "measures",
                items: [
                    {
                        measure: {
                            localIdentifier: "m0",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        identifier: "itemId",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        ],
    };

    const emptyMdObject: VisualizationObject.IVisualizationObjectContent = {
        visualizationClass: {
            uri: "",
        },
        buckets: [],
    };

    const mdObject: VisualizationObject.IVisualizationObjectContent = {
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
                                        uri: "/gdc/md/project/obj/metric.id",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "attribute",
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

    function createComponent(customProps: Partial<IVisualizationGenericADProps> = {}) {
        return shallow<IVisualizationGenericADProps, IVisualizationGenericADState>(
            <VisualizationGenericADPure
                sdk={factory()}
                projectId="FoodMartDemo"
                locale="en-US"
                visualizationClass={testMocks.dummyTableVisualizationClass}
                mdObject={mdObject}
                isMdObjectValid={true}
                {...customProps}
            />,
        );
    }

    it("should create data source on component mount", () => {
        const mockedDataSourceFactory = jest.fn(createDataSource);
        const initialProps: Partial<IVisualizationGenericADProps> = {
            dataSourceFactory: mockedDataSourceFactory,
        };
        const component = createComponent(initialProps);

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(1);
        expect(component.state("dataSource")).not.toBeNull();
    });

    it("should not create dataSource when visualization is not executable", () => {
        const mockedDataSourceFactory = jest.fn(createDataSource);
        const initialProps: Partial<IVisualizationGenericADProps> = {
            mdObject: emptyMdObject,
            dataSourceFactory: mockedDataSourceFactory,
        };

        const component = createComponent(initialProps);
        expect(mockedDataSourceFactory).not.toHaveBeenCalled();
        expect(component.state("dataSource")).toBeNull();
    });

    it("should not create dataSource when mdObject changed from empty to another empty", () => {
        const mockedDataSourceFactory = jest.fn(createDataSource);
        const initialProps: Partial<IVisualizationGenericADProps> = {
            mdObject: emptyMdObject,
            dataSourceFactory: mockedDataSourceFactory,
        };

        const component = createComponent(initialProps);

        const anotherEmptyMdObject = cloneDeep(emptyMdObject);
        anotherEmptyMdObject.visualizationClass.uri = "zzz";

        return delay().then(() => {
            component.setProps({
                visualizationClass: testMocks.dummyTableVisualizationClass,
                mdObject: anotherEmptyMdObject,
            });

            expect(component.state("dataSource")).toBeNull();
        });
    });

    it("should keep original datasource when visualization type changes but afm does not", () => {
        const initialProps: Partial<IVisualizationGenericADProps> = {
            visualizationClass: testMocks.dummyColumnVisualizationClass,
            mdObject: executableMdObject,
        };

        const component = createComponent(initialProps);

        return delay().then(() => {
            const dataSource = component.state("dataSource");
            component.setProps({
                visualizationClass: testMocks.dummyTableVisualizationClass,
                mdObject: executableMdObject,
            });

            expect(component.state("dataSource")).toEqual(dataSource);
        });
    });

    it("should create datasource when visualization type changes and afm is executable", () => {
        const initialProps: Partial<IVisualizationGenericADProps> = {
            mdObject: executableMdObject,
            visualizationClass: testMocks.dummyColumnVisualizationClass,
        };

        const component = createComponent(initialProps);

        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );
        expect(dataSource).not.toBeNull();

        component.setProps({
            visualizationClass: testMocks.dummyTableVisualizationClass,
        });

        expect(component.state("dataSource")).not.toBeNull();
    });

    it("should initially create datasource with expanded native totals in afm", () => {
        const initialProps: Partial<IVisualizationGenericADProps> = {
            mdObject: visualizationObjectMock.withTotals,
            visualizationClass: testMocks.dummyTableVisualizationClass,
        };

        const component = createComponent(initialProps);

        expect(component.state("dataSource")).not.toBeNull();
        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );

        const expectedNativeTotals: AFM.INativeTotalItem[] = [
            {
                measureIdentifier: "m1",
                attributeIdentifiers: [],
            },
            {
                measureIdentifier: "m2",
                attributeIdentifiers: [],
            },
        ];
        expect(dataSource.getAfm().nativeTotals).toEqual(expectedNativeTotals);
    });

    it("should update datasource with expanded native totals if mdObject changed", () => {
        const initialProps: Partial<IVisualizationGenericADProps> = {
            mdObject: visualizationObjectMock.withoutTotals,
            visualizationClass: testMocks.dummyTableVisualizationClass,
        };

        const component = createComponent(initialProps);

        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );
        expect(dataSource.getAfm().nativeTotals).toBeUndefined();

        component.setProps({
            mdObject: visualizationObjectMock.withTotals,
        });

        const updatedDataSource: DataLayer.DataSource.IDataSource<
            Execution.IExecutionResponses
        > = component.state("dataSource");
        const expectedNativeTotals: AFM.INativeTotalItem[] = [
            {
                measureIdentifier: "m1",
                attributeIdentifiers: [],
            },
            {
                measureIdentifier: "m2",
                attributeIdentifiers: [],
            },
        ];
        expect(updatedDataSource.getAfm().nativeTotals).toEqual(expectedNativeTotals);
    });

    it("should create already pre-rejected dataSource for chart without measure", () => {
        const component = createComponent({
            mdObject: {
                visualizationClass: { uri: "" },
                buckets: [
                    {
                        localIdentifier: "view",
                        items: [
                            {
                                visualizationAttribute: {
                                    localIdentifier: "a1",
                                    displayForm: {
                                        uri: "uri",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            visualizationClass: testMocks.dummyColumnVisualizationClass,
        });
        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );

        return dataSource.getData({}).catch((err: object) => {
            expect(err).toEqual(INVALID_BUCKETS_RESPONSE);
        });
    });

    it("should create already pre-resolved dataSource when executionResult is available", () => {
        const executionResult: any = { result: [] };
        const component = createComponent({
            visualizationClass: testMocks.dummyColumnVisualizationClass,
            executionResult,
        });
        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );

        return dataSource.getData({}).then((result: object) => {
            expect(result).toEqual(executionResult);
        });
    });

    it("should execute second time if buckets in mdObject changed", () => {
        const mockedDataSourceFactory = jest.fn(createDataSource);

        const initialProps: Partial<IVisualizationGenericADProps> = {
            visualizationClass: testMocks.dummyColumnVisualizationClass,
            mdObject: executableMdObject,
            dataSourceFactory: mockedDataSourceFactory,
        };
        const component = createComponent(initialProps);

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(1);

        component.setProps({
            mdObject: visualizationObjectMock.withSorts,
        });

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(2);

        const newResultSpec = component.prop("resultSpec");
        expect(newResultSpec).toEqual({
            sorts: [
                {
                    measureSortItem: {
                        direction: "asc",
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });

    it("should execute second time if filters in mdObject changed", () => {
        const mockedDataSourceFactory = jest.fn(createDataSource);

        const initialProps: Partial<IVisualizationGenericADProps> = {
            visualizationClass: testMocks.dummyColumnVisualizationClass,
            mdObject: executableMdObject,
            dataSourceFactory: mockedDataSourceFactory,
        };
        const component = createComponent(initialProps);

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(1);

        const mdObjectWithFilters = set(cloneDeep(executableMdObject), "filters", [
            { absoluteDateFilter: { dataSet: "/uri/to/dataset" } },
        ]);
        component.setProps({
            mdObject: mdObjectWithFilters,
        });

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(2);
    });

    it("should create new dataSource if executionResult changes", () => {
        const execResult: Execution.IExecutionResponses = {
            executionResponse: {
                dimensions: [],
                links: {
                    executionResult: "asd",
                },
            },
            executionResult: {
                paging: {
                    total: [1],
                    offset: [0],
                    count: [1],
                },
                data: [[0]],
            },
        };

        const mockedDataSourceFactory = jest.fn(createDataSource);

        const initialProps: Partial<IVisualizationGenericADProps> = {
            visualizationClass: testMocks.dummyColumnVisualizationClass,
            dataSourceFactory: mockedDataSourceFactory,
        };
        const component = createComponent(initialProps);

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(1);

        component.setProps({
            executionResult: execResult,
        });

        expect(mockedDataSourceFactory).toHaveBeenCalledTimes(2);

        const dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> = component.state(
            "dataSource",
        );

        return dataSource.getData({}).then(res => {
            expect(res).toEqual(execResult);
        });
    });

    describe("rendering", () => {
        it("passes down provided properties", () => {
            const drillableItems: IDrillableItem[] = [];
            const props = {
                drillableItems,
                afterRender: () => {
                    noop();
                },
                onError: () => {
                    noop();
                },
                onExportReady: () => {
                    noop();
                },
                onLoadingChanged: () => {
                    noop();
                },
                pushData: () => {
                    noop();
                },
                referencePoint: referencePointMocks.emptyReferencePoint,
                visualizationProperties: {},
                onExtendedReferencePointChanged: () => {
                    noop();
                },
                onNewDerivedBucketItemsPlaced: () => {
                    noop();
                },
                featureFlags: {
                    testFlag: true,
                },
                config: {
                    separators: {
                        thousand: ".", // German number format
                        decimal: ",",
                    },
                },
                newDerivedBucketItems: [referencePointMocks.derivedMeasureItems[0]],
            };

            const component = createComponent(props);
            const baseVisualization = component.find(BaseVisualization);
            expect(baseVisualization.props()).toMatchObject(props);
        });
    });
});

describe("createDataSource", () => {
    it("should create data source with empty response if AFM is not executable", () => {
        const afm: AFM.IAfm = {
            attributes: [],
            measures: [],
            filters: [],
        };

        const dataSource = createDataSource(
            afm,
            testMocks.emptyMdObject,
            testMocks.dummyTableVisualizationClass,
            factory(),
            "projId",
        );

        return dataSource.getData({}).then(noop, err => {
            expect(err).toEqual(EMPTY_AFM_RESPONSE);
        });
    });

    it("should create data source with invalid buckets response, if buckets are invalid", () => {
        const afm: AFM.IAfm = {
            attributes: [
                {
                    localIdentifier: "a1",
                    displayForm: {
                        identifier: "aid1",
                    },
                },
            ],
        };

        const dataSource = createDataSource(
            afm,
            testMocks.emptyMdObject,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
        );

        return dataSource.getData({}).then(noop, err => {
            expect(err).toEqual(INVALID_BUCKETS_RESPONSE);
        });
    });

    it("should create pre-resolved data source, if executionResult is present", () => {
        const afm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                identifier: "m1",
                            },
                        },
                    },
                },
            ],
            filters: [
                {
                    positiveAttributeFilter: {
                        displayForm: {
                            uri: "attr/uri",
                        },
                        in: [],
                    },
                },
            ],
        };

        const execResult: Execution.IExecutionResponses = {
            executionResponse: {
                dimensions: [],
                links: {
                    executionResult: "asd",
                },
            },
            executionResult: {
                paging: {
                    total: [1],
                    offset: [0],
                    count: [1],
                },
                data: [[0]],
            },
        };

        const dataSource = createDataSource(
            afm,
            testMocks.stackedMdObject,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
            execResult,
        );

        expect(dataSource.getFingerprint()).toBe(
            '{"afm":{' +
                '"attributes":[],' +
                '"filters":[{"positiveAttributeFilter":{"displayForm":{"uri":"attr/uri"},"in":[]}}],' +
                '"measures":[{"definition":{"measure":{"item":{"identifier":"m1"}}},"localIdentifier":"m1"}],' +
                '"nativeTotals":[]},' +
                '"bucketItemsPositionSignature":[{"items":["m1"],"localIdentifier":"measures"},' +
                '{"items":["a1"],"localIdentifier":"view"},{"items":["a2"],"localIdentifier":"stack"}]}',
        );
        return dataSource.getData({}).then(res => {
            expect(res).toEqual(execResult);
        });
    });

    it("should create data source with correct afm", () => {
        const afm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                identifier: "m1",
                            },
                        },
                    },
                },
            ],
        };

        const dataSource = createDataSource(
            afm,
            testMocks.singleMeasureMdObject,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
        );
        const dataSourceAfm = dataSource.getAfm();

        expect(dataSourceAfm).toEqual(afm);
    });

    it("should create different DataSource fingerprint for different order and position of bucket items", () => {
        const afm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                identifier: "m1",
                            },
                        },
                    },
                },
            ],
        };

        const vizObject1 = cloneDeep(testMocks.singleMeasureMdObject);
        vizObject1.buckets[1] = {
            items: [],
            localIdentifier: SECONDARY_MEASURES,
        };
        const dataSource1 = createDataSource(
            afm,
            vizObject1,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
        );

        const vizObject2 = cloneDeep(testMocks.singleMeasureMdObject);
        const items = vizObject2.buckets[0].items;
        vizObject2.buckets[0].items = [];
        vizObject2.buckets[1] = {
            items,
            localIdentifier: SECONDARY_MEASURES,
        };

        const dataSource2 = createDataSource(
            afm,
            vizObject2,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
        );

        expect(dataSource1.getFingerprint()).not.toEqual(dataSource2.getFingerprint());
    });

    it("should execute afm without touching the global and measure date filters", () => {
        const afm: AFM.IAfm = {
            filters: [
                {
                    relativeDateFilter: {
                        dataSet: {
                            uri: "/date-dataset-uri",
                        },
                        granularity: "GDC.time.year",
                        from: -1,
                        to: -1,
                    },
                },
            ],
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                uri: "/uri1",
                            },
                        },
                    },
                },
                {
                    localIdentifier: "m2",
                    definition: {
                        measure: {
                            item: {
                                uri: "/uri2",
                            },
                            filters: [
                                {
                                    relativeDateFilter: {
                                        dataSet: {
                                            uri: "/gdc/md/i6k6sk4sznefv1kf0f2ls7jf8tm5ida6/obj/164",
                                        },
                                        granularity: "GDC.time.month",
                                        from: 0,
                                        to: 0,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        };
        const resultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: [],
                },
                {
                    itemIdentifiers: [],
                },
            ],
            sorts: [],
        };

        const sdk = factory();
        const spyOnExecuteAfm = jest.spyOn(sdk.execution, "executeAfm").mockImplementation(
            () =>
                new Promise(resolve => {
                    resolve();
                }),
        );

        const dataSource = createDataSource(
            afm,
            testMocks.singleMeasureMdObject,
            testMocks.dummyColumnVisualizationClass,
            sdk,
            "projId",
        );

        return dataSource.getData(resultSpec).then(() => {
            expect(spyOnExecuteAfm).toBeCalledWith("projId", {
                execution: {
                    afm: {
                        ...afm, // the executed AFM is the same as the input one
                    },
                    resultSpec: {
                        ...resultSpec,
                    },
                },
            });
            spyOnExecuteAfm.mockReset();
        });
    });

    it("should create data source with cached result", async () => {
        const afm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                identifier: "m1",
                            },
                        },
                    },
                },
            ],
        };

        const dummyExecutionResult: Execution.IExecutionResponses = {
            executionResponse: {
                dimensions: [],
                links: {
                    executionResult: "/dummy/link",
                },
            },
            executionResult: {
                data: ["1"],
                paging: {
                    count: [1],
                    offset: [0],
                    total: [1],
                },
            },
        };

        const dataSource = createDataSource(
            afm,
            testMocks.singleMeasureMdObject,
            testMocks.dummyColumnVisualizationClass,
            factory(),
            "projId",
            dummyExecutionResult,
        );
        const data = await dataSource.getData({});

        expect(data).toEqual(dummyExecutionResult);
    });
});

describe("visualisationHasInvalidBuckets", () => {
    it("should return false if visualization is table and has attributes only)", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.mdObjectAttributeOnly,
                testMocks.dummyTableVisualizationClass,
            ),
        ).toBeFalsy();
    });

    it("should return true if visualization is other than table and has attribute only", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.mdObjectAttributeOnly,
                testMocks.dummyColumnVisualizationClass,
            ),
        ).toBeTruthy();
    });

    it("should return false if visualization is other than table and has measure", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.singleMeasureMdObject,
                testMocks.dummyColumnVisualizationClass,
            ),
        ).toBeFalsy();
    });

    it("should return false if vis. is headline and just the primary measures bucket contains a measure", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.singleMeasureMdObject,
                testMocks.dummyHeadlineVisualizationClass,
            ),
        ).toBeFalsy();
    });

    it("should return false if vis. is headline and both primary and secondary measures contain single measure", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.doubleMeasureHeadlineMdObject,
                testMocks.dummyHeadlineVisualizationClass,
            ),
        ).toBeFalsy();
    });

    it("should return true if vis. is headline and just secondary measure bucket contains a measure", () => {
        expect(
            visualisationHasInvalidBuckets(
                testMocks.secondMeasureHeadlineMdObject,
                testMocks.dummyHeadlineVisualizationClass,
            ),
        ).toBeTruthy();
    });
});
