// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { SDK, DataLayer } from "@gooddata/gooddata-js";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import get = require("lodash/get");
import * as stringify from "json-stable-stringify";

import { AFM, VisualizationObject, Execution, VisualizationClass } from "@gooddata/typings";
import {
    ErrorCodes,
    IDrillableItem,
    MeasureTitleHelper,
    VisEvents,
    VisualizationTypes,
    BucketNames,
} from "../../index";
import { BaseVisualization } from "./BaseVisualization";
import {
    IFeatureFlags,
    ILocale,
    IReferencePoint,
    IVisualizationProperties,
    IBucketItem,
    IGdcConfig,
    IReferences,
} from "../interfaces/Visualization";
import { defaultErrorHandler } from "../utils/defaultHandlers";
import { expandTotalsInAfm } from "../utils/executionObjectHelper";
import { DEFAULT_LOCALE } from "../utils/intlProvider";
import BucketItem = VisualizationObject.BucketItem;

const { DataSource, AfmUtils, toAfmResultSpec } = DataLayer;

export interface IVisualizationGenericADProps extends VisEvents.IEvents {
    sdk: SDK;
    projectId: string;
    locale: ILocale;
    visualizationClass: VisualizationClass.IVisualizationClass;
    mdObject: VisualizationObject.IVisualizationObjectContent;
    config?: IGdcConfig;
    isMdObjectValid: boolean;
    drillableItems?: IDrillableItem[];
    executionResult?: Execution.IExecutionResponses;
    containerHeight?: number;
    containerWidth?: number;
    visualizationProperties?: IVisualizationProperties;
    references?: IReferences;
    referencePoint?: IReferencePoint;
    newDerivedBucketItems?: IBucketItem[];
    featureFlags?: IFeatureFlags;
    onError?: VisEvents.OnError;
    onExportReady?: VisEvents.OnExportReady;
    onLoadingChanged?: VisEvents.OnLoadingChanged;
    afterRender?(): void;
    pushData?(): void;
    onExtendedReferencePointChanged?(): void;
    onNewDerivedBucketItemsPlaced?(): void;
    dataSourceFactory?(
        afm: AFM.IAfm,
        mdObject: VisualizationObject.IVisualizationObjectContent,
        visualizationClass: VisualizationClass.IVisualizationClass,
        sdk: SDK,
        projectId: string,
        executionResult?: Execution.IExecutionResponses,
    ): DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>;
}

export interface IVisualizationGenericADState {
    dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>;
    resultSpec: AFM.IResultSpec;
}

export const EMPTY_AFM_RESPONSE = {
    response: {
        status: ErrorCodes.EMPTY_AFM,
        json: () => Promise.resolve(null),
        text: () => Promise.resolve(null),
    },
};

export const INVALID_BUCKETS_RESPONSE = {
    response: {
        status: ErrorCodes.INVALID_BUCKETS,
        json: () => Promise.resolve(null),
        text: () => Promise.resolve(null),
    },
};

/*  ----- Visualization component tree -----
 *
 *  AD:   [ReportVisualization]
 *                |
 *                ▼
 *  App: [VisualizationGenericAD]  (creates dataSource)
 *                |
 *                ▼
 *        [BaseVisualization]
 *                |
 *                ▼
 *        <div .gd-vis-{ID}>  +  new IVisualization({ element: .gd-vis-{ID} })
 *
 *       =====  New React tree from here =====
 *       [PluggableBarChart] extends [PluggableBaseChart] implements IVisualization
 *       OR [PluggableTable] implements IVisualization
 *       - render( . ) to prop.element
 *                 |
 *                 ▼    ◣---- [BarChart] and other SDK components
 *  ReactComp: [BaseChart]
 *                 |
 *                 ▼
 *           [Visualization]
 *
 *
 * more at: https://confluence.intgdc.com/display/VS/INTERNAL+ONLY+App+Components+-+Pluggable+Visualizations
 */

export class VisualizationGenericADPure extends React.Component<
    IVisualizationGenericADProps,
    IVisualizationGenericADState
> {
    public static defaultProps: Partial<IVisualizationGenericADProps> = {
        drillableItems: [],
        referencePoint: null,
        references: null,
        newDerivedBucketItems: [],
        afterRender: noop,
        onError: defaultErrorHandler,
        onExportReady: noop,
        onLoadingChanged: noop,
        pushData: noop,
        visualizationProperties: null,
        onExtendedReferencePointChanged: noop,
        onNewDerivedBucketItemsPlaced: noop,
        dataSourceFactory: createDataSource,
        featureFlags: {},
    };

    private locale: ILocale;

    constructor(props: IVisualizationGenericADProps) {
        super(props);

        this.locale = props.locale ? props.locale : DEFAULT_LOCALE;

        this.state = {
            dataSource: null,
            resultSpec: null,
        };
    }

    public componentWillMount() {
        const {
            dataSourceFactory,
            executionResult,
            visualizationClass,
            sdk,
            projectId,
            mdObject,
        } = this.props;

        const { afm, resultSpec } = this.getOptimizedAfmResultSpec(mdObject);

        if (AfmUtils.isAfmExecutable(afm)) {
            const dataSource = dataSourceFactory(
                afm,
                mdObject,
                visualizationClass,
                sdk,
                projectId,
                executionResult,
            );
            this.setState({ dataSource, resultSpec });
        }
    }

    public componentWillReceiveProps(nextProps: IVisualizationGenericADProps) {
        const {
            dataSourceFactory,
            executionResult,
            visualizationClass,
            sdk,
            projectId,
            mdObject,
        } = nextProps;

        const { afm, resultSpec } = this.getOptimizedAfmResultSpec(mdObject);

        let { dataSource } = this.state;

        if (this.isNewDataSourceNeeded(mdObject, visualizationClass, executionResult)) {
            dataSource = dataSourceFactory(
                afm,
                mdObject,
                visualizationClass,
                sdk,
                projectId,
                executionResult,
            );
        }

        this.setState({ dataSource, resultSpec });
    }

    public render() {
        const {
            visualizationClass,
            afterRender,
            onError,
            onExportReady,
            onLoadingChanged,
            locale,
            pushData,
            drillableItems,
            containerHeight,
            visualizationProperties,
            referencePoint,
            onExtendedReferencePointChanged,
            mdObject,
            config,
            isMdObjectValid,
            featureFlags,
            newDerivedBucketItems,
            onNewDerivedBucketItemsPlaced,
            references,
            projectId,
        } = this.props;

        const { dataSource, resultSpec } = this.state;

        return (
            <BaseVisualization
                projectId={projectId}
                mdObject={mdObject}
                isMdObjectValid={isMdObjectValid}
                references={references}
                config={config}
                dataSource={dataSource}
                resultSpec={resultSpec}
                drillableItems={drillableItems}
                totalsEditAllowed={true}
                featureFlags={featureFlags}
                afterRender={afterRender}
                height={containerHeight}
                onError={onError}
                onExportReady={onExportReady}
                onLoadingChanged={onLoadingChanged}
                pushData={pushData}
                visualizationClass={visualizationClass}
                locale={locale}
                newDerivedBucketItems={newDerivedBucketItems}
                visualizationProperties={visualizationProperties}
                referencePoint={referencePoint}
                onExtendedReferencePointChanged={onExtendedReferencePointChanged}
                onNewDerivedBucketItemsPlaced={onNewDerivedBucketItemsPlaced}
            />
        );
    }

    private getOptimizedAfmResultSpec(mdObject: VisualizationObject.IVisualizationObjectContent) {
        const mdWithTitlesAndAliases = MeasureTitleHelper.fillMissingTitles(mdObject, this.locale);
        const { afm, resultSpec } = toAfmResultSpec(mdWithTitlesAndAliases);

        const optimizedAfm = expandTotalsInAfm(afm);

        return {
            afm: optimizedAfm,
            resultSpec,
        };
    }

    private isNewDataSourceNeeded(
        mdObject: VisualizationObject.IVisualizationObjectContent,
        visualizationClass: VisualizationClass.IVisualizationClass,
        executionResult: Execution.IExecutionResponses,
    ): boolean {
        const {
            mdObject: currentMdObject,
            visualizationClass: currentVisualizationClass,
            executionResult: currentExecutionResult,
        } = this.props;

        return (
            !isEqual(mdObject.buckets, currentMdObject.buckets) ||
            !isEqual(mdObject.filters, currentMdObject.filters) ||
            !isEqual(currentExecutionResult, executionResult) ||
            visualisationHasInvalidBuckets(mdObject, visualizationClass) !==
                visualisationHasInvalidBuckets(currentMdObject, currentVisualizationClass)
        );
    }
}

export interface IBucketTypesCounts {
    measures: number;
    attributes: number;
}

export function getBucketItemsCountByType(buckets: VisualizationObject.IBucket[]): IBucketTypesCounts {
    const counts = {
        measures: 0,
        attributes: 0,
    };

    buckets.forEach(bucket => {
        bucket.items.forEach(item => {
            if (get(item, "visualizationAttribute")) {
                counts.attributes++;
            } else if (get(item, "measure")) {
                counts.measures++;
            }
        });
    });

    return counts;
}

export function visualisationHasInvalidBuckets(
    mdObject: VisualizationObject.IVisualizationObjectContent,
    visualizationClass: VisualizationClass.IVisualizationClass,
) {
    const isTable = visualizationClass.content.url === `local:${VisualizationTypes.TABLE}`;
    const isHeadline = visualizationClass.content.url === `local:${VisualizationTypes.HEADLINE}`;
    const counts = getBucketItemsCountByType(mdObject.buckets);

    return (
        (isTable && counts.measures + counts.attributes === 0) ||
        (!isTable && counts.measures === 0) ||
        (isHeadline &&
            mdObject.buckets &&
            mdObject.buckets[0].localIdentifier === BucketNames.SECONDARY_MEASURES)
    );
}

export function createDataSource(
    afm: AFM.IAfm,
    mdObject: VisualizationObject.IVisualizationObjectContent,
    visualizationClass: VisualizationClass.IVisualizationClass,
    sdk: SDK,
    projectId: string,
    executionResult?: Execution.IExecutionResponses,
): DataLayer.DataSource.IDataSource<Execution.IExecutionResponses> {
    if (!AfmUtils.isAfmExecutable(afm)) {
        return createEmptyResponseDataSource(afm, mdObject);
    }

    if (visualisationHasInvalidBuckets(mdObject, visualizationClass)) {
        return createInvalidBucketsDataSource(afm, mdObject);
    }

    if (executionResult) {
        return createCachedResultDataSource(afm, mdObject, projectId, sdk, executionResult);
    }

    return createNewDataSource(afm, mdObject, projectId, sdk);
}

function createEmptyResponseDataSource(
    afm: AFM.IAfm,
    mdObject: VisualizationObject.IVisualizationObjectContent,
) {
    return new DataSource.DataSource(
        () => Promise.reject(EMPTY_AFM_RESPONSE),
        AfmUtils.normalizeAfm(afm),
        getDataSourceFingerprint(afm, mdObject),
        () => Promise.reject(EMPTY_AFM_RESPONSE),
    );
}

function createInvalidBucketsDataSource(
    afm: AFM.IAfm,
    mdObject: VisualizationObject.IVisualizationObjectContent,
) {
    return new DataSource.DataSource(
        () => Promise.reject(INVALID_BUCKETS_RESPONSE),
        AfmUtils.normalizeAfm(afm),
        getDataSourceFingerprint(afm, mdObject),
        () => Promise.reject(INVALID_BUCKETS_RESPONSE),
    );
}

function createCachedResultDataSource(
    afm: AFM.IAfm,
    mdObject: VisualizationObject.IVisualizationObjectContent,
    projectId: string,
    sdk: SDK,
    executionResult: Execution.IExecutionResponses,
) {
    // responseFactory and resultFactory are NOT cached, because current cache only supports executionResult
    const responseFactory = (resultSpec: AFM.IResultSpec) => {
        const execution: AFM.IExecution = {
            execution: {
                afm,
                resultSpec,
            },
        };
        return sdk.execution.getExecutionResponse(projectId, execution);
    };
    const resultFactory = sdk.execution.getPartialExecutionResult;

    // this is extremely fragile, other code relies on this "undo/redo" datasource to be different from ordinary
    // datasource and the normalisation makes the difference
    const normalisedAfm = AfmUtils.normalizeAfm(afm);
    return new DataSource.DataSource(
        () => Promise.resolve(executionResult),
        normalisedAfm,
        getDataSourceFingerprint(normalisedAfm, mdObject),
        responseFactory,
        resultFactory,
    );
}

function createNewDataSource(
    afm: AFM.IAfm,
    mdObject: VisualizationObject.IVisualizationObjectContent,
    projectId: string,
    sdk: SDK,
) {
    const execFactory = (resultSpec: AFM.IResultSpec) => {
        const execution: AFM.IExecution = {
            execution: {
                afm,
                resultSpec,
            },
        };

        return sdk.execution.executeAfm(projectId, execution);
    };

    const responseFactory = (resultSpec: AFM.IResultSpec) => {
        const execution: AFM.IExecution = {
            execution: {
                afm,
                resultSpec,
            },
        };
        return sdk.execution.getExecutionResponse(projectId, execution);
    };

    const resultFactory = sdk.execution.getPartialExecutionResult;

    return new DataSource.DataSource(
        execFactory,
        afm,
        getDataSourceFingerprint(afm, mdObject),
        responseFactory,
        resultFactory,
    );
}

function getDataSourceFingerprint(afm: AFM.IAfm, mdObject: VisualizationObject.IVisualizationObjectContent) {
    const bucketItemsPositionSignature = mdObject.buckets.map((bucket: VisualizationObject.IBucket) => ({
        localIdentifier: bucket.localIdentifier,
        items: bucket.items.map((item: BucketItem) => {
            if (VisualizationObject.isMeasure(item)) {
                return item.measure.localIdentifier;
            }
            if (VisualizationObject.isVisualizationAttribute(item)) {
                return item.visualizationAttribute.localIdentifier;
            }
        }),
    }));

    return stringify({
        afm,
        bucketItemsPositionSignature,
    });
}

export const VisualizationGenericAD = (props: IVisualizationGenericADProps) => {
    return (
        // TODO: unify versions of react-measure
        <div>
            <VisualizationGenericADPure
                {...props}
                containerHeight={400}
                containerWidth={400}
            />
        </div>
    );
};
