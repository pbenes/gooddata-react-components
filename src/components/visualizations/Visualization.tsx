// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as invariant from 'invariant';
import isEqual = require('lodash/isEqual');
import noop = require('lodash/noop');
import isFunction = require('lodash/isFunction');
import omitBy = require('lodash/omitBy');

// TODO: will be ported later
import {
    TableTransformation
} from '@gooddata/indigo-visualizations';

import {
    Execution
} from '@gooddata/typings';

import {
    isTable,
    isChartSupported,
    stringifyChartTypes
} from './utils/common';
import { Highcharts, IChartConfig } from './chart/Chart';
import { IDrillableItem } from '../../interfaces/DrillEvents';
import ChartTransformation, { IExecutionRequest, renderHighCharts } from './chart/ChartTransformation';

export interface IVisualizationProps {
    height: number;
    width: number;
    config: IChartConfig;
    numericSymbols: string[];

    executionRequest: IExecutionRequest;
    executionResponse: Execution.IExecutionResponse['executionResponse'];
    executionResult: Execution.IExecutionResult['executionResult'];
    drillableItems: IDrillableItem[];

    onFiredDrillEvent(): void;
    afterRender(): void;
    onDataTooLarge(): void;
    onNegativeValues(): void;
    onLegendReady(): void;
}

export class Visualization extends React.Component<IVisualizationProps> {
    public static defaultProps = {
        numericSymbols: [] as string[],
        onFiredDrillEvent: noop,
        afterRender: noop
    };

    constructor(props: IVisualizationProps) {
        super(props);

        this.setNumericSymbols(this.props);
    }

    public componentWillReceiveProps(nextProps: IVisualizationProps) {
        this.setNumericSymbols(nextProps);
    }

    public shouldComponentUpdate(nextProps: IVisualizationProps) {
        return !isEqual(omitBy(this.props, isFunction), omitBy(nextProps, isFunction));
    }

    public setNumericSymbols(props: IVisualizationProps) {
        const { numericSymbols } = props;

        if (numericSymbols && numericSymbols.length) {
            Highcharts.setOptions({
                lang: {
                    numericSymbols
                }
            });
        }
    }

    public render(): JSX.Element {
        const visType = this.props.config.type;

        if (isTable(visType)) {
            return (
                <TableTransformation {...this.props} />
            );
        }

        if (isChartSupported(visType)) {
            const {
                height,
                width,
                config,
                executionRequest,
                executionResponse,
                executionResult,
                drillableItems,
                onFiredDrillEvent,
                afterRender,
                onDataTooLarge,
                onNegativeValues,
                onLegendReady
            } = this.props;

            return (
                <ChartTransformation
                    height={height}
                    width={width}
                    config={config}
                    drillableItems={drillableItems}

                    executionRequest={executionRequest}
                    executionResponse={executionResponse}
                    executionResult={executionResult}

                    afterRender={afterRender}
                    onFiredDrillEvent={onFiredDrillEvent}
                    onDataTooLarge={onDataTooLarge}
                    onNegativeValues={onNegativeValues}
                    onLegendReady={onLegendReady}
                    renderer={renderHighCharts}
                />
            );
        }

        invariant(false,
            `Unknown visualization type: ${visType}. Supported visualization types: ${stringifyChartTypes()}`);

        return null;
    }
}
