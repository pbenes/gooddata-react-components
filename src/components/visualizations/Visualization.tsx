// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as invariant from 'invariant';
import { noop, isEqual, isFunction, omitBy } from 'lodash';
import * as Highcharts from 'highcharts';

// TODO: will be ported by DavidOcetnik
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

import { IChartConfig } from './chart/Chart';
import ChartTransformation, { IExecutionRequest, IDrillableItems, renderHighCharts } from './chart/ChartTransformation';

export interface IVisualizationProps {
    height: number;
    width: number;
    config: IChartConfig;
    numericSymbols: string[];

    executionRequest: IExecutionRequest;
    executionResponse: Execution.IExecutionResponse;
    executionResult: Execution.IExecutionResult;
    drillableItems: IDrillableItems[];

    onFiredDrillEvent(): void; // TODO: fix
    afterRender(): void; // TODO: fix
    onDataTooLarge(): void;
    onNegativeValues(): void;
    onLegendReady(): void; // TODO: check if used
}

export class Visualization extends React.Component<IVisualizationProps, null> {
    public static propTypes = { // TODO: delete?
        config: PropTypes.shape({
            type: PropTypes.string.isRequired
        }).isRequired,
        onFiredDrillEvent: PropTypes.func,
        numericSymbols: PropTypes.array,
        afterRender: PropTypes.func
    };

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

        invariant(isChartSupported(visType),
            `Unknown visualization type: ${visType}. Supported visualization types: ${stringifyChartTypes()}`);

        return null;
    }
}
