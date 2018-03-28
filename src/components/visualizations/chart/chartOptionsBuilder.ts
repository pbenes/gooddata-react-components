// (C) 2007-2018 GoodData Corporation
import { colors2Object, numberFormat } from '@gooddata/numberjs';
import * as invariant from 'invariant';
import { AFM } from '@gooddata/typings';

import { range, get, without, escape, unescape, isUndefined } from 'lodash';

import {
    parseValue,
    getAttributeElementIdFromAttributeElementUri,
    isLineChart,
    isAreaChart,
    isPieChart,
    isChartSupported,
    stringifyChartTypes
} from '../utils/common';

import { getMeasureUriOrIdentifier, isDrillable } from '../utils/drilldownEventing';
import { DEFAULT_COLOR_PALETTE, getLighterColor } from '../utils/color';
import { isDataOfReasonableSize } from './highChartsCreators';
import { VIEW_BY_DIMENSION_INDEX, STACK_BY_DIMENSION_INDEX, PIE_CHART_LIMIT } from './constants';

import { DEFAULT_CATEGORIES_LIMIT } from './highcharts/commonConfiguration';

const enableAreaChartStacking = (stacking: string) => {
    return stacking || isUndefined(stacking);
};

export function unwrap(wrappedObject: any) {
    return wrappedObject[Object.keys(wrappedObject)[0]];
}

export function isNegativeValueIncluded(series: any) {
    return series
        .some((seriesItem: any) => (
            seriesItem.data.some(({ y }: any) => (y < 0))
        ));
}

export function validateData(limits: any = {}, chartOptions: any) {
    const pieChartLimits = {
        series: 1, // pie charts can have just one series
        categories: Math.min(limits.categories || DEFAULT_CATEGORIES_LIMIT, PIE_CHART_LIMIT)
    };

    const { type } = chartOptions;

    return {
        // series and categories limit
        dataTooLarge: !isDataOfReasonableSize(chartOptions.data, isPieChart(type)
            ? pieChartLimits
            : limits),
        // check pie chart for negative values
        hasNegativeValue: isPieChart(type) && isNegativeValueIncluded(chartOptions.data.series)
    };
}

export function isPopMeasure(measureItem: any, afm: AFM.IAfm) {
    return afm.measures.some((measure: any) => {
        const popMeasureIdentifier = get(measure, 'definition.popMeasure') ? measure.localIdentifier : null;
        return popMeasureIdentifier && popMeasureIdentifier === measureItem.measureHeaderItem.localIdentifier;
    });
}

export function normalizeColorToRGB(color: string) {
    const hexPattern = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
    return color.replace(hexPattern, ({}, r: string, g: string, b: string) => {
        return `rgb(${[r, g, b].map(value => (parseInt(value, 16).toString(10))).join(', ')})`;
    });
}

export function getColorPalette(
    colorPalette: string[] = DEFAULT_COLOR_PALETTE,
    measureGroup: any,
    viewByAttribute: any,
    stackByAttribute: any,
    afm: AFM.IAfm,
    type: string
) {
    let updatedColorPalette: string[] = [];
    const isAttributePieChart = isPieChart(type) && afm.attributes && afm.attributes.length > 0;

    if (stackByAttribute || isAttributePieChart) {
        const itemsCount = stackByAttribute ? stackByAttribute.items.length : viewByAttribute.items.length;
        updatedColorPalette = range(itemsCount)
            .map(itemIndex => colorPalette[itemIndex % colorPalette.length]);
    } else {
        let linkedPopMeasureCounter = 0;
        measureGroup.items.forEach((measureItem: any, measureItemIndex: number) => {
            // skip linked popMeasures in color palete
            const colorIndex = (measureItemIndex - linkedPopMeasureCounter) % colorPalette.length;
            let color = colorPalette[colorIndex];

            // if this is a pop measure and we found it`s original measure
            if (isPopMeasure(measureItem, afm)) {
                // find source measure
                const measureDefinition = afm.measures[measureItemIndex].definition as AFM.IPopMeasureDefinition;
                const sourceMeasureIdentifier = measureDefinition.popMeasure.measureIdentifier;
                const sourceMeasureIndex = afm.measures.findIndex(
                    (measure: AFM.IMeasure) => measure.localIdentifier === sourceMeasureIdentifier
                );
                if (sourceMeasureIndex > -1) {
                    linkedPopMeasureCounter += 1;
                    // copy sourceMeasure color and lighten it if it exists, then insert it at pop measure position
                    const sourceMeasureColorIndex =
                        (sourceMeasureIndex - linkedPopMeasureCounter) % colorPalette.length;
                    const sourceMeasureColor = colorPalette[sourceMeasureColorIndex];
                    const popMeasureColor = getLighterColor(normalizeColorToRGB(sourceMeasureColor), 0.6);
                    color = popMeasureColor;
                }
            }
            updatedColorPalette.push(color);
        });
    }
    return updatedColorPalette;
}

interface IPointData {
    y: number;
    format: string;
    marker: {
        enabled: boolean;
    };
    name?: string;
    color?: string;
    legendIndex?: number;
}

export function getSeriesItemData(
    seriesItem: any,
    seriesIndex: number,
    measureGroup: any,
    viewByAttribute: any,
    stackByAttribute: any,
    type: string,
    colorPalette: string[]
) {
    return seriesItem.map((pointValue: any, pointIndex: any) => {
        // by default seriesIndex corresponds to measureGroup label index
        let measureIndex = seriesIndex;
        // by default pointIndex corresponds to viewBy label index
        let viewByIndex = pointIndex;
        // drillContext can have 1 to 3 items
        // viewBy attribute label, stackby label if available
        // last drillContextItem is always current serie measure
        if (stackByAttribute) {
            // pointIndex corresponds to viewBy attribute label (if available)
            viewByIndex = pointIndex;
            // stack bar chart has always just one measure
            measureIndex = 0;
        } else if (isPieChart(type) && !viewByAttribute) {
            measureIndex = pointIndex;
        }

        const pointData: IPointData = {
            y: parseValue(pointValue),
            format: unwrap(measureGroup.items[measureIndex]).format,
            marker: {
                enabled: pointValue !== null
            }
        };
        if (stackByAttribute) {
            // if there is a stackBy attribute, then seriesIndex corresponds to stackBy label index
            pointData.name = unwrap(stackByAttribute.items[seriesIndex]).name;
        } else if (isPieChart(type) && viewByAttribute) {
            pointData.name = unwrap(viewByAttribute.items[viewByIndex]).name;
        } else {
            pointData.name = unwrap(measureGroup.items[measureIndex]).name;
        }

        if (isPieChart(type)) {
            // add color to pie chart points from colorPalette
            pointData.color = colorPalette[pointIndex];
            // Pie charts use pointData viewByIndex as legendIndex if available instead of seriesItem legendIndex
            pointData.legendIndex = viewByAttribute ? viewByIndex : pointIndex;
        }
        return pointData;
    });
}

export function getSeries(
    executionResultData: any,
    measureGroup: any,
    viewByAttribute: any,
    stackByAttribute: any,
    type: any,
    colorPalette: any
) {
    return executionResultData.map((seriesItem: any, seriesIndex: any) => {
        const seriesItemData = getSeriesItemData(
            seriesItem,
            seriesIndex,
            measureGroup,
            viewByAttribute,
            stackByAttribute,
            type,
            colorPalette
        );
        const seriesItemConfig: any = {
            color: colorPalette[seriesIndex],
            legendIndex: seriesIndex,
            data: seriesItemData
        };

        if (stackByAttribute) {
            // if stackBy attribute is available, seriesName is a stackBy attribute value of index seriesIndex
            // this is a limitiation of highcharts and a reason why you can not have multi-measure stacked charts
            seriesItemConfig.name = stackByAttribute.items[seriesIndex].attributeHeaderItem.name;
        } else if (isPieChart(type) && !viewByAttribute) {
            // Pie charts with measures only have a single series which name would is ambiguous
            seriesItemConfig.name = measureGroup.items.map((wrappedMeasure: any) => {
                return unwrap(wrappedMeasure).name;
            }).join(', ');
        } else {
            // otherwise seriesName is a measure name of index seriesIndex
            seriesItemConfig.name = measureGroup.items[seriesIndex].measureHeaderItem.name;
        }

        return seriesItemConfig;
    });
}

export const customEscape = (str: any) => str && escape(unescape(str));

export function generateTooltipFn(viewByAttribute: any, type: any) {
    const formatValue = (val: any, format: any) => {
        return colors2Object(numberFormat(val, format));
    };

    return (point: any) => {
        const formattedValue = customEscape(formatValue(point.y, point.format).label);
        const textData = [[customEscape(point.series.name), formattedValue]];

        if (viewByAttribute) {
            // For some reason, highcharts ommit categories for pie charts with attribute. Use point.name instead.
            // use attribute name instead of attribute display form name
            textData.unshift([customEscape(viewByAttribute.formOf.name), customEscape(point.category || point.name)]);
        } else if (isPieChart(type)) {
            // Pie charts with measure only have to use point.name instead of series.name to get the measure name
            textData[0][0] = customEscape(point.name);
        }

        return `<table class="tt-values">${textData.map(line => (
            `<tr>
                <td class="title">${line[0]}</td>
                <td class="value">${line[1]}</td>
            </tr>`
        )).join('\n')}</table>`;
    };
}

export function findInDimensionHeaders(dimensions: any, headerCallback: any): any {
    let returnValue: any = null;
    dimensions.some((dimension: any, dimensionIndex: any) => {
        dimension.headers.some((wrappedHeader: any, headerIndex: any) => {
            const headerType = Object.keys(wrappedHeader)[0];
            const header = wrappedHeader[headerType];
            const headerCount = dimension.headers.length;
            returnValue = headerCallback(headerType, header, dimensionIndex, headerIndex, headerCount);
            return !!returnValue;
        });
        return !!returnValue;
    });
    return returnValue;
}

export function findMeasureGroupInDimensions(dimensions: any) {
    return findInDimensionHeaders(dimensions,
        (headerType: any, header: any, {}, headerIndex: any, headerCount: any) => {
            const measureGroupHeader = headerType === 'measureGroupHeader' ? header : null;
            if (measureGroupHeader) {
                invariant(headerIndex === headerCount - 1, 'MeasureGroup must be the last header in it\'s dimension');
            }
            return measureGroupHeader;
        });
}

export function findAttributeInDimension(dimension: any, attributeHeaderItemsDimension: any) {
    return findInDimensionHeaders([dimension], (headerType: any, header: any) => {
        if (headerType === 'attributeHeader') {
            return {
                ...header,
                // attribute items are delivered separately from attributeHeaderItems
                // there should ever only be maximum of one attribute on each dimension, other attributes are ignored
                items: attributeHeaderItemsDimension[0]
            };
        }
        return null;
    });
}

export function getDrillContext(stackByItem: any, viewByItem: any, measure: any, afm: AFM.IAfm) {
    return without([
        stackByItem,
        viewByItem,
        measure
    ], null).map(({
        uri, // header attribute value or measure uri
        identifier = '', // header attribute value or measure identifier
        name, // header attribute value or measure text label
        format, // measure format
        localIdentifier,
        attribute // attribute header if available
    }) => {
        return {
            id: attribute
                ? getAttributeElementIdFromAttributeElementUri(uri)
                : localIdentifier, // attribute value id or measure localIndentifier
            ...(attribute ? {} : {
                format
            }),
            value: name, // text label of attribute value or formatted measure value
            identifier: attribute ? attribute.identifier : identifier, // identifier of attribute or measure
            uri: attribute
                ? attribute.uri // uri of attribute
                : get(getMeasureUriOrIdentifier(afm, localIdentifier), 'uri') // uri of measure
        };
    });
}

export function getDrillableSeries(
    series: any,
    drillableItems: any,
    measureGroup: any,
    viewByAttribute: any,
    stackByAttribute: any,
    type: any,
    afm: any
) {
    const isMetricPieChart = isPieChart(type) && !viewByAttribute;

    return series.map((seriesItem: any, seriesIndex: any) => {
        let isSeriesDrillable = false;
        const data = seriesItem.data.map((pointData: any, pointIndex: any) => {
            // measureIndex is usually seriesIndex,
            // except for stack by attribute and metricOnly pie chart it is looped-around pointIndex instead
            // Looping around the end of items array only works when measureGroup is the last header on it's dimension
            // We do not support setups with measureGroup before attributeHeaders
            const measureIndex = !stackByAttribute && !isMetricPieChart
                ? seriesIndex
                : pointIndex % measureGroup.items.length;
            const measure = unwrap(measureGroup.items[measureIndex]);

            const viewByItem = viewByAttribute ? {
                ...unwrap(viewByAttribute.items[pointIndex]),
                attribute: viewByAttribute
            } : null;

            // stackBy item index is always equal to seriesIndex
            const stackByItem = stackByAttribute ? {
                ...unwrap(stackByAttribute.items[seriesIndex]),
                attribute: stackByAttribute
            } : null;

            // point is drillable if a drillableItem matches:
            //   point's measure,
            //   point's viewBy attribute,
            //   point's viewBy attribute item,
            //   point's stackBy attribute,
            //   point's stackBy attribute item,
            const drillableHooks = without([
                measure,
                viewByAttribute,
                viewByItem,
                stackByAttribute,
                stackByItem
            ], null);

            const drilldown = drillableHooks.some(drillableHook =>
                isDrillable(drillableItems, drillableHook, afm)
            );

            const drillableProps: any = {
                drilldown
            };
            if (drilldown) {
                drillableProps.drillContext = getDrillContext(measure, viewByItem, stackByItem, afm);
                isSeriesDrillable = true;
            }
            return {
                ...pointData,
                ...drillableProps
            };
        });

        return {
            ...seriesItem,
            data,
            isDrillable: isSeriesDrillable
        };
    });
}

function getCategories(type: any, viewByAttribute: any, measureGroup: any) {
    // Categories make up bar/slice labels in charts. These usually match view by attribute values.
    // Measure only pie charts geet categories from measure names
    if (viewByAttribute) {
        return viewByAttribute.items.map(({ attributeHeaderItem }: any) => attributeHeaderItem.name);
    }
    if (isPieChart(type)) {
        // Pie chart with measures only (no viewByAttribute) needs to list
        return measureGroup.items.map((wrappedMeasure: any) => unwrap(wrappedMeasure).name);
        // Pie chart categories are later sorted by seriesItem pointValue
    }
    return [];
}

function getStackingConfig(stackByAttribute: any, options: any) {
    const stackingValue = 'normal';
    const { type, stacking } = options;

    const isNotLineOrAreaChart = !(isLineChart(type) || isAreaChart(type));

    /**
     * we should enable stacking for one of the following cases :
     * 1) If stackby attibute have been set and chart is not line/area chart
     * 2) If chart is an area chart and stacking is enabled (stackBy attribute doesn't matter)
     */
    const isStackByChart = stackByAttribute && isNotLineOrAreaChart;
    const isAreaChartWithEnabledStacking = isAreaChart(type) && enableAreaChartStacking(stacking);
    if (isStackByChart || isAreaChartWithEnabledStacking) {
        return stackingValue;
    }

    // No stacking
    return null;
}

/**
 * Creates an object providing data for all you need to render a chart except drillability.
 *
 * @param afm <executionRequest.AFM> object listing metrics and attributes used.
 * @param resultSpec <executionRequest.resultSpec> object defining expected result dimension structure,
 * @param dimensions <executionResponse.dimensions> array defining calculated dimensions and their headers,
 * @param executionResultData <executionResult.data> array with calculated data
 * @param unfilteredHeaderItems <executionResult.headerItems> array of attribute header items mixed with measures
 * @param config object defining chart display settings
 * @param drillableItems array of items for isPointDrillable matching
 * @return Returns composed chart options object
 */
export function getChartOptions(
    afm: any,
    {},
    dimensions: any,
    executionResultData: any,
    unfilteredHeaderItems: any,
    config: any,
    drillableItems: any
) {
    // Future version of API will return measures alongside attributeHeaderItems
    // we need to filter these out in order to stay compatible
    const attributeHeaderItems = unfilteredHeaderItems.map((dimension: any) => {
        return dimension.filter((attributeHeaders: any) => attributeHeaders[0].attributeHeaderItem);
    });

    invariant(config && isChartSupported(config.type),
        `config.type must be defined and match one of supported chart types: ${stringifyChartTypes()}`);

    const { type } = config;
    const measureGroup = findMeasureGroupInDimensions(dimensions);
    const viewByAttribute = findAttributeInDimension(
        dimensions[VIEW_BY_DIMENSION_INDEX],
        attributeHeaderItems[VIEW_BY_DIMENSION_INDEX]
    );
    const stackByAttribute = findAttributeInDimension(
        dimensions[STACK_BY_DIMENSION_INDEX],
        attributeHeaderItems[STACK_BY_DIMENSION_INDEX]
    );

    invariant(measureGroup, 'missing measureGroup');

    const colorPalette =
        getColorPalette(config.colors, measureGroup, viewByAttribute, stackByAttribute, afm, type);

    const seriesWithoutDrillability = getSeries(
        executionResultData,
        measureGroup,
        viewByAttribute,
        stackByAttribute,
        type,
        colorPalette
    );

    const series = getDrillableSeries(
        seriesWithoutDrillability,
        drillableItems,
        measureGroup,
        viewByAttribute,
        stackByAttribute,
        type,
        afm
    );

    let categories = getCategories(type, viewByAttribute, measureGroup);
    const stacking = getStackingConfig(stackByAttribute, config);

    // Pie charts dataPoints are sorted by default by value in descending order
    if (isPieChart(type)) {
        const dataPoints = series[0].data;
        const indexSortOrder: any[] = [];
        const sortedDataPoints = dataPoints.sort((pointDataA: any, pointDataB: any) => {
            if (pointDataA.y === pointDataB.y) { return 0; }
            return pointDataB.y - pointDataA.y;
        }).map((dataPoint: any, dataPointIndex: any) => {
            // Legend index equals original dataPoint index
            indexSortOrder.push(dataPoint.legendIndex);
            return {
                // after sorting, colors need to be reassigned in original order and legendIndex needs to be reset
                ...dataPoint,
                color: dataPoints[dataPoint.legendIndex].color,
                legendIndex: dataPointIndex
            };
        });
        // categories need to be sorted in exactly the same order as dataPoints
        categories = categories.map(({}, dataPointIndex: any) => categories[indexSortOrder[dataPointIndex]]);
        series[0].data = sortedDataPoints;
    }

    // Attribute axis labels come from attribute instead of attribute display form.
    // They are listed in attribute headers. So we need to find one attribute header and read the attribute name
    const xLabel = config.xLabel || (viewByAttribute ? viewByAttribute.formOf.name : '');
    // if there is only one measure, yLabel is name of this measure, otherwise an empty string
    const yLabel = config.yLabel || (measureGroup.items.length === 1 ? unwrap(measureGroup.items[0]).name : '');
    const yFormat = config.yFormat || unwrap(measureGroup.items[0]).format;

    return {
        type,
        stacking,
        legendLayout: config.legendLayout || 'horizontal',
        colorPalette,
        title: {
            x: xLabel,
            y: yLabel,
            yFormat
        },
        showInPercent: measureGroup.items.some((wrappedMeasure: any) => {
            const measure = wrappedMeasure[Object.keys(wrappedMeasure)[0]];
            return measure.format.includes('%');
        }),
        data: {
            series,
            categories
        },
        actions: {
            tooltip: generateTooltipFn(viewByAttribute, type)
        }
    };
}
