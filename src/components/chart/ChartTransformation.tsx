// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as invariant from 'invariant';

import noop = require('lodash/noop');
import {
    ExecutionRequestPropTypes,
    ExecutionResponsePropTypes,
    ExecutionResultPropTypes
} from '../proptypes/execution';
import { getChartOptions, validateData } from './chartOptionsBuilder';
import { getHighchartsOptions } from './highChartsCreators';
import getLegend from './legend/legendBuilder';
import HighChartRenderer from './HighChartRenderer';
import DrillableItem from '../proptypes/DrillableItem';

export function renderHighCharts(props: any) {
    return <HighChartRenderer {...props} />;
}

export default class ChartTransformation extends React.Component<any, any> {
    public static propTypes = {
        config: PropTypes.shape({
            type: PropTypes.string.isRequired,
            legend: PropTypes.shape({
                enabled: PropTypes.bool
            }),
            colors: PropTypes.arrayOf(PropTypes.string),
            stacking: PropTypes.bool
        }).isRequired,
        limits: PropTypes.shape({
            series: PropTypes.number,
            categories: PropTypes.number
        }),
        drillableItems: PropTypes.arrayOf(PropTypes.shape(DrillableItem)),
        height: PropTypes.number,
        width: PropTypes.number,

        afterRender: PropTypes.func,
        renderer: PropTypes.func,
        onDataTooLarge: PropTypes.func.isRequired,
        onNegativeValues: PropTypes.func,
        onFiredDrillEvent: PropTypes.func,
        onLegendReady: PropTypes.func,

        executionRequest: ExecutionRequestPropTypes.isRequired,
        executionResponse: ExecutionResponsePropTypes.isRequired,
        executionResult: ExecutionResultPropTypes.isRequired
    };

    public static defaultProps = {
        afm: {},
        drillableItems: [] as any,
        renderer: renderHighCharts,
        afterRender: noop,
        onNegativeValues: null as any,
        onFiredDrillEvent: noop,
        onLegendReady: noop,
        limits: {},
        height: undefined as any,
        width: undefined as any
    };

    private chartOptions: any;

    public componentWillMount() {
        this.assignChartOptions(this.props);
    }

    public componentWillReceiveProps(nextProps: any) {
        this.assignChartOptions(nextProps);
    }

    public getRendererProps() {
        const { chartOptions } = this;
        const {
            executionRequest: { afm },
            height,
            width,
            afterRender,
            config,
            onFiredDrillEvent,
            onLegendReady
        } = this.props;
        const drillConfig = { afm, onFiredDrillEvent };
        const hcOptions = getHighchartsOptions(chartOptions, drillConfig);
        return {
            chartOptions,
            hcOptions,
            height,
            width,
            afterRender,
            onLegendReady,
            legend: getLegend(config.legend, chartOptions)
        };
    }

    public assignChartOptions(props: any) {
        const {
            drillableItems,
            executionRequest: { afm, resultSpec },
            executionResponse: { dimensions },
            executionResult: { data, headerItems },
            config,
            onDataTooLarge,
            onNegativeValues
        } = props;

        this.chartOptions = getChartOptions(
            afm,
            resultSpec,
            dimensions,
            data,
            headerItems,
            config,
            drillableItems
        );
        const validationResult = validateData(config.limits, this.chartOptions);

        if (validationResult.dataTooLarge) {
            // always force onDataTooLarge error handling
            invariant(onDataTooLarge, 'Visualization\'s onDataTooLarge callback is missing.');
            onDataTooLarge(this.chartOptions);
        } else if (validationResult.hasNegativeValue) {
            // ignore hasNegativeValue if validation already fails on dataTooLarge
            // force onNegativeValues error handling only for pie chart.
            // hasNegativeValue can be true only for pie chart.
            invariant(onNegativeValues,
                '"onNegativeValues" callback required for pie chart transformation is missing.');
            onNegativeValues(this.chartOptions);
        }
        this.setState(validationResult);

        return this.chartOptions;
    }

    public render() {
        if (this.state.dataTooLarge || this.state.hasNegativeValue) {
            return null;
        }
        return this.props.renderer(this.getRendererProps());
    }
}
