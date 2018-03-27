// (C) 2007-2018 GoodData Corporation
import { setWith, clone, includes } from 'lodash';
import { Observable } from 'rxjs/Rx';

import {
    TABLE,
    COLUMN_CHART,
    BAR_CHART,
    LINE_CHART,
    PIE_CHART,
    AREA_CHART,
    DOUGHNUT_CHART,
    HEADLINE,
    CHART_TYPES
} from '../VisualizationTypes';

// TODO: lodash/fp does not provide typings :-(
// https://stackoverflow.com/questions/38020019/where-can-i-find-typescript-typings-for-lodash-fp
/* tslint:disable */
const isEqual = require('lodash/fp/isEqual');
/* tslint:enable */

export function parseValue(value: any) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? null : parsedValue;
}

export const immutableSet = (dataSet: any, path: any, newValue: any) => setWith({ ...dataSet }, path, newValue, clone);

export const repeatItemsNTimes = (array: any, n: any) =>
    new Array(n).fill(null).reduce(result => [...result, ...array], []);

export function subscribeEvent(event: any, debounce: any, func: any, target: any = window): any {
    if (debounce > 0) {
        return Observable
            .fromEvent(target, event)
            .debounceTime(debounce)
            .subscribe(func);
    }

    return Observable
        .fromEvent(target, event)
        .subscribe(func);
}

export function subscribeEvents(func: any, events: any, target: any= window) {
    return events.map((event: any) => {
        return subscribeEvent(event.name, event.debounce, func, target);
    });
}

export const unEscapeAngleBrackets = (str: any) => str && str.replace(/&lt;|&#60;/g, '<').replace(/&gt;|&#62;/g, '>');

export function getAttributeElementIdFromAttributeElementUri(attributeElementUri: any) {
    const match = '/elements?id=';
    return attributeElementUri.slice(attributeElementUri.lastIndexOf(match) + match.length);
}

export const isTable = isEqual(TABLE);
export const isColumnChart = isEqual(COLUMN_CHART);
export const isBarChart = isEqual(BAR_CHART);
export const isLineChart = isEqual(LINE_CHART);
export const isPieChart = isEqual(PIE_CHART);
export const isAreaChart = isEqual(AREA_CHART);
export const isDoughnutChart = isEqual(DOUGHNUT_CHART);
export const isHeadline = isEqual(HEADLINE);
export const isChartSupported = (type : any) => includes(CHART_TYPES, type);
export const stringifyChartTypes = () => CHART_TYPES.join(', ');
