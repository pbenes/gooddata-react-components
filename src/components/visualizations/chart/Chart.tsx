// (C) 2007-2018 GoodData Corporation
import isEqual = require('lodash/isEqual');
import noop = require('lodash/noop');
import * as React from 'react';
import { initChartPlugins } from './highcharts/chartPlugins';

// Have only one entrypoint to highcharts and drill module
// tslint:disable-next-line
export const Highcharts = require('highcharts/highcharts');
const drillmodule = require('highcharts/modules/drilldown'); // tslint:disable-line
const treemapModule = require('highcharts/modules/treemap'); // tslint:disable-line
const funnelModule = require('highcharts/modules/funnel'); // tslint:disable-line
const heatmap = require('highcharts/modules/heatmap'); // tslint:disable-line
drillmodule(Highcharts);
treemapModule(Highcharts);
funnelModule(Highcharts);
heatmap(Highcharts);
initChartPlugins(Highcharts);

export interface ILegendConfig {
    enabled?: boolean;
    position?: 'top' | 'left' | 'right' | 'bottom';
    responsive?: boolean;
}

export interface IChartLimits {
    series?: number;
    categories?: number;
}

export interface IChartConfig {
    colors?: string[];
    type?: string;
    legend?: ILegendConfig;
    limits?: IChartLimits;
    stacking?: boolean;
    grid?: any;
    mdObject?: any;
    yFormat?: string;
    yLabel?: string;
    xLabel?: string;
    xFormat?: string;
}

export interface IChartProps {
    config: IChartConfig;
    domProps: any;
    callback(): void;
}

export default class Chart extends React.Component<IChartProps> {
    public static defaultProps: Partial<IChartProps> = {
        callback: noop,
        domProps: {}
    };

    private chart: Highcharts.ChartObject;
    private chartRef: HTMLElement;

    public constructor(props: IChartProps) {
        super(props);
        this.setChartRef = this.setChartRef.bind(this);
    }

    public componentDidMount() {
        this.createChart(this.props.config);
    }

    public shouldComponentUpdate(nextProps: IChartProps) {
        if (isEqual(this.props.config, nextProps.config)) {
            return false;
        }

        return true;
    }

    public componentDidUpdate() {
        this.createChart(this.props.config);
    }

    public componentWillUnmount() {
        this.chart.destroy();
    }

    public setChartRef(ref: HTMLElement) {
        this.chartRef = ref;
    }

    public getChart() {
        if (!this.chart) {
            throw new Error('getChart() should not be called before the component is mounted');
        }

        return this.chart;
    }

    public createChart(config: any) {
        const chartConfig = config.chart;
        this.chart = new Highcharts.Chart(
            {
                ...config,
                chart: {
                    ...chartConfig,
                    renderTo: this.chartRef
                }
            },
            this.props.callback
        );
    }

    public render() {
        return (
            <div
                {...this.props.domProps}
                ref={this.setChartRef}
            />
        );
    }
}
