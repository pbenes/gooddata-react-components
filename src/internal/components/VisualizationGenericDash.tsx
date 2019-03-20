// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { InjectedIntl } from "react-intl";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import { SDK, DataLayer, ApiResponseError } from "@gooddata/gooddata-js";

import { AFM, Execution, VisualizationObject, VisualizationClass } from "@gooddata/typings";
import {
    ErrorStates,
    IDrillableItem,
    VisEvents,
    MeasureTitleHelper,
    RuntimeError,
} from "../../index";

import { BaseVisualization } from "./BaseVisualization";
import { defaultErrorHandler } from "../utils/defaultHandlers";
import {
    IFeatureFlags,
    ILocale,
    IVisCallbacks,
    IVisualizationProperties,
    IGdcConfig,
} from "../interfaces/Visualization";
import { createIntl, DEFAULT_LOCALE } from "../utils/intlProvider";
import {
    getVisualizationOptions,
    IVisualizationOptions,
} from "../utils/dashboards/visualizationDateFilterOptions";

export type IExecutionDataSource = DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>;

export interface IVisualizationGenericDashProps extends IVisCallbacks {
    uri: string;
    sdk: SDK;
    projectId: string;
    height: number;
    config?: IGdcConfig;
    visualizationClass: VisualizationClass.IVisualizationClass;
    mdObject: VisualizationObject.IVisualizationObjectContent;
    visualizationProperties?: IVisualizationProperties;
    stickyHeaderOffset?: number;
    locale: ILocale;
    attributeFilters?: AFM.AttributeFilterItem[];
    dateFilter?: AFM.DateFilterItem;
    drillableItems?: IDrillableItem[];
    featureFlags?: IFeatureFlags;
    onError?: (error: RuntimeError, options?: IVisualizationOptions) => void;
    onExportReady?: VisEvents.OnExportReady;
    onLoadingChanged?: VisEvents.OnLoadingChanged;
    onFiredDrillEvent?: VisEvents.OnFiredDrillEvent;
}

export interface IVisualizationGenericDashState {
    dataSource: IExecutionDataSource;
    resultSpec: AFM.IResultSpec;
}

export interface IVisualizationExecInfo {
    dataSource: IExecutionDataSource;
    resultSpec: AFM.IResultSpec;
}

export class VisualizationGenericDash extends React.Component<
    IVisualizationGenericDashProps,
    IVisualizationGenericDashState
> {
    public static defaultProps: Partial<IVisualizationGenericDashProps> = {
        stickyHeaderOffset: 0,
        attributeFilters: [],
        drillableItems: [],
        afterRender: noop,
        onError: defaultErrorHandler,
        onExportReady: noop,
        onLoadingChanged: noop,
        pushData: noop,
        featureFlags: {},
    };

    private subject: DataLayer.ISubject<Promise<IVisualizationExecInfo>>;

    private adapter: DataLayer.ExecuteAfmAdapter;

    private intl: InjectedIntl;
    private locale: ILocale;

    constructor(props: IVisualizationGenericDashProps) {
        super(props);

        this.state = {
            dataSource: null,
            resultSpec: {},
        };

        this.adapter = new DataLayer.ExecuteAfmAdapter(this.props.sdk, this.props.projectId);

        this.locale = props.locale ? props.locale : DEFAULT_LOCALE;
        this.intl = createIntl(this.locale);

        this.subject = DataLayer.createSubject<IVisualizationExecInfo>(
            ({ dataSource, resultSpec }) => {
                this.setState({
                    dataSource,
                    resultSpec,
                });
            },
            (error: ApiResponseError) => {
                this.props.onError(new RuntimeError(ErrorStates.UNKNOWN_ERROR, error));
            },
        );

        this.onError = this.onError.bind(this);
        this.pushData = this.pushData.bind(this);
    }

    public componentDidMount() {
        const { uri, attributeFilters, dateFilter } = this.props;
        this.createDataSource(uri, attributeFilters, dateFilter);
    }

    public visualizationChanged(nextProps: IVisualizationGenericDashProps) {
        const dateChanged = !isEqual(this.props.dateFilter, nextProps.dateFilter);
        const attributeFiltersChanged = !isEqual(this.props.attributeFilters, nextProps.attributeFilters);
        const uriChanged = this.props.uri !== nextProps.uri;

        return dateChanged || attributeFiltersChanged || uriChanged;
    }

    public componentWillReceiveProps(nextProps: IVisualizationGenericDashProps) {
        const { uri, attributeFilters, dateFilter } = nextProps;

        if (this.visualizationChanged(nextProps)) {
            this.createDataSource(uri, attributeFilters, dateFilter);
        }
    }

    public componentWillUnmount() {
        this.subject.unsubscribe();
    }

    public render() {
        const { dataSource } = this.state;
        if (!dataSource) {
            return null;
        }

        const {
            projectId,
            mdObject,
            visualizationClass,
            afterRender,
            onExportReady,
            onLoadingChanged,
            locale,
            stickyHeaderOffset,
            drillableItems,
            height,
            featureFlags,
            config,
            visualizationProperties,
        } = this.props;

        return (
            <BaseVisualization
                projectId={projectId}
                mdObject={mdObject}
                config={config}
                environment="dashboards"
                stickyHeaderOffset={stickyHeaderOffset}
                drillableItems={drillableItems}
                featureFlags={featureFlags}
                height={height}
                dataSource={dataSource}
                resultSpec={this.state.resultSpec}
                afterRender={afterRender}
                onError={this.onError}
                onExportReady={onExportReady}
                onLoadingChanged={onLoadingChanged}
                pushData={this.pushData}
                visualizationClass={visualizationClass}
                locale={locale}
                visualizationProperties={visualizationProperties}
            />
        );
    }

    private createDataSource(
        uri: string,
        attributeFilters: AFM.AttributeFilterItem[],
        dateFilter: AFM.DateFilterItem,
    ) {
        const promise = this.props.sdk.md.getVisualization(uri).then(mdObject => {
            const content: VisualizationObject.IVisualizationObjectContent =
                mdObject.visualizationObject.content;
            const mdWithTitlesAndAliases = MeasureTitleHelper.fillMissingTitles(content, this.locale);
            const { afm, resultSpec } = DataLayer.toAfmResultSpec(mdWithTitlesAndAliases);

            const afmWithAttributeFilters: AFM.IAfm = DataLayer.AfmUtils.appendFilters(
                afm,
                attributeFilters,
                dateFilter,
            );

            return this.adapter
                .createDataSource(afmWithAttributeFilters)
                .then((dataSource: IExecutionDataSource) => {
                    return {
                        dataSource,
                        resultSpec,
                    };
                });
        });
        this.subject.next(promise);
    }

    private onError(error: RuntimeError) {
        const options = getVisualizationOptions(this.state.dataSource.getAfm());

        this.props.onError(error, options);
    }

    private pushData(data: any) {
        const options = getVisualizationOptions(this.state.dataSource.getAfm());

        this.props.pushData(data, options);
    }
}
