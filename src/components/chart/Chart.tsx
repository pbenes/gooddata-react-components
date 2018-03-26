// (C) 2007-2018 GoodData Corporation
import * as Highcharts from 'highcharts';
import { noop, isEqual } from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class Chart extends React.Component<any, null> {
    public static propTypes = {
        callback: PropTypes.func,
        config: PropTypes.object.isRequired,
        domProps: PropTypes.object
    };

    public static defaultProps = {
        callback: noop,
        domProps: {}
    };

    private chart: any;
    private chartRef: any;

    public constructor(props: any) {
        super(props);
        this.setChartRef = this.setChartRef.bind(this);
    }

    public componentDidMount() {
        this.createChart(this.props.config);
    }

    public shouldComponentUpdate(nextProps: any) {
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

    public setChartRef(ref: any) {
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
