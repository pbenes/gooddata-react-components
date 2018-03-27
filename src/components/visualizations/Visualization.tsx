// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as invariant from 'invariant';
import { noop, isEqual, isFunction, omitBy } from 'lodash';
import * as Highcharts from 'highcharts';

import ChartTransformation from './chart/ChartTransformation';
// TODO: will be ported by DavidOcetnik
import {
    TableTransformation
} from '@gooddata/indigo-visualizations';

import {
    isTable,
    isChartSupported,
    stringifyChartTypes
} from './utils/common';

export class Visualization extends React.Component<any, any> {
    public static propTypes = {
        config: PropTypes.shape({
            type: PropTypes.string.isRequired
        }).isRequired,
        onFiredDrillEvent: PropTypes.func,
        numericSymbols: PropTypes.array,
        afterRender: PropTypes.func
    };

    public static defaultProps = {
        numericSymbols: [] as any[],
        onFiredDrillEvent: noop,
        afterRender: noop
    };

    constructor(props: any) {
        super(props);

        this.setNumericSymbols(this.props);
    }

    public componentWillReceiveProps(nextProps: any) {
        this.setNumericSymbols(nextProps);
    }

    public shouldComponentUpdate(nextProps: any) {
        return !isEqual(omitBy(this.props, isFunction), omitBy(nextProps, isFunction));
    }

    public setNumericSymbols(props: any = {}) {
        const { numericSymbols } = props;

        if (numericSymbols && numericSymbols.length) {
            Highcharts.setOptions({
                lang: {
                    numericSymbols
                }
            });
        }
    }

    public render() {
        const visType = this.props.config.type;

        if (isTable(visType)) {
            return (
                <TableTransformation {...this.props} />
            );
        }

        if (isChartSupported(visType)) {
            return (
                <ChartTransformation {...this.props} />
            );
        }

        invariant(isChartSupported(visType),
            `Unknown visualization type: ${visType}. Supported visualization types: ${stringifyChartTypes()}`);

        return false;
    }
}
