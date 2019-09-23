// (C) 2007-2019 GoodData Corporation
import get = require("lodash/get");
import debounce = require("lodash/debounce");
import * as CustomEvent from "custom-event";
import * as invariant from "invariant";
import Highcharts from "../chart/highcharts/highchartsEntryPoint";
import {
    ChartElementType,
    ChartType,
    VisType,
    VisualizationTypes,
} from "../../../constants/visualizationTypes";
import {
    IDrillEventExtended,
    IDrillEventContextGroup,
    //    IDrillEventIntersectionElement,
    IDrillEventContextTableExtended,
    IDrillPointExtended,
    IHighchartsPointObjectExtended,
    IDrillConfig,
    ICellDrillEventExtended,
    isGroupHighchartsDrillEvent,
    IDrillEventContextPointExtended,
    IDrillEventContextExtended,
} from "../../../interfaces/DrillEvents";
import { OnFiredDrillEvent } from "../../../interfaces/Events";
import { isComboChart, isHeatmap, isTreemap } from "./common";
import { getVisualizationType } from "../../../helpers/visualizationType";

export function getClickableElementNameByChartType(type: VisType): ChartElementType {
    switch (type) {
        case VisualizationTypes.LINE:
        case VisualizationTypes.AREA:
        case VisualizationTypes.SCATTER:
        case VisualizationTypes.BUBBLE:
            return "point";
        case VisualizationTypes.COLUMN:
        case VisualizationTypes.BAR:
            return "bar";
        case VisualizationTypes.PIE:
        case VisualizationTypes.TREEMAP:
        case VisualizationTypes.DONUT:
        case VisualizationTypes.FUNNEL:
            return "slice";
        case VisualizationTypes.HEATMAP:
            return "cell";
        default:
            invariant(false, `Unknown visualization type: ${type}`);
            return null;
    }
}

function fireEvent(onFiredDrillEvent: OnFiredDrillEvent, data: any, target: EventTarget) {
    const returnValue = onFiredDrillEvent(data);

    // if user-specified onFiredDrillEvent fn returns false, do not fire default DOM event
    if (returnValue !== false) {
        const event = new CustomEvent("drill", {
            detail: data,
            bubbles: true,
        });
        target.dispatchEvent(event);
    }
}

function composeDrillContextGroup(
    points: IHighchartsPointObjectExtended[],
    chartType: ChartType,
): IDrillEventContextGroup {
    const sanitizedPoints = sanitizeContextPoints(chartType, points);
    const contextPoints: IDrillPointExtended[] = sanitizedPoints.map(
        (point: IHighchartsPointObjectExtended) => {
            const customProps: Partial<IDrillPointExtended> = isComboChart(chartType)
                ? { type: get(point, "series.type") }
                : {};

            return {
                x: point.x,
                y: point.y,
                intersection: point.drillIntersection,
                ...customProps,
            };
        },
    );

    return {
        type: chartType,
        element: "label",
        points: contextPoints,
    };
}

function composeDrillContextPoint(
    point: IHighchartsPointObjectExtended,
    chartType: ChartType,
): IDrillEventContextPointExtended {
    const zProp = isNaN(point.z) ? {} : { z: point.z };
    const valueProp =
        isTreemap(chartType) || isHeatmap(chartType)
            ? {
                  value: point.value ? point.value.toString() : "",
              }
            : {};
    const xyProp = isTreemap(chartType)
        ? {}
        : {
              x: point.x,
              y: point.y,
          };

    const elementChartType: ChartType = get(point, "series.type", chartType);
    const customProp: Partial<IDrillEventContextPointExtended> = isComboChart(chartType)
        ? {
              elementChartType,
          }
        : {};

    return {
        type: chartType,
        element: getClickableElementNameByChartType(elementChartType),
        intersection: point.drillIntersection,
        ...xyProp,
        ...zProp,
        ...valueProp,
        ...customProp,
    };
}

const chartClickDebounced = debounce(
    (
        drillConfig: IDrillConfig,
        event: Highcharts.DrilldownEventObject,
        target: EventTarget,
        chartType: ChartType,
    ) => {
        const { afm, onFiredDrillEvent } = drillConfig;
        const type = getVisualizationType(chartType);
        let drillContext: IDrillEventContextExtended;

        if (isGroupHighchartsDrillEvent(event)) {
            const points = event.points as IHighchartsPointObjectExtended[];
            drillContext = composeDrillContextGroup(points, type);
        } else {
            const point: IHighchartsPointObjectExtended = event.point as IHighchartsPointObjectExtended;
            drillContext = composeDrillContextPoint(point, type);
        }

        const data: IDrillEventExtended = {
            executionContext: afm,
            drillContext,
        };

        fireEvent(onFiredDrillEvent, data, target);
    },
);

export function chartClick(
    drillConfig: IDrillConfig,
    event: Highcharts.DrilldownEventObject,
    target: EventTarget,
    chartType: ChartType,
) {
    chartClickDebounced(drillConfig, event, target, chartType);
}

const tickLabelClickDebounce = debounce(
    (
        drillConfig: IDrillConfig,
        points: IHighchartsPointObjectExtended[],
        target: EventTarget,
        chartType: ChartType,
    ): void => {
        const { afm, onFiredDrillEvent } = drillConfig;
        const sanitizedPoints = sanitizeContextPoints(chartType, points);
        const contextPoints: IDrillPointExtended[] = sanitizedPoints.map(
            (point: IHighchartsPointObjectExtended) => ({
                x: point.x,
                y: point.y,
                intersection: point.drillIntersection,
            }),
        );
        const drillContext: IDrillEventContextExtended = {
            type: chartType,
            element: "label",
            points: contextPoints,
        };
        const data: IDrillEventExtended = {
            executionContext: afm,
            drillContext,
        };

        fireEvent(onFiredDrillEvent, data, target);
    },
);

function sanitizeContextPoints(
    chartType: ChartType,
    points: IHighchartsPointObjectExtended[],
): IHighchartsPointObjectExtended[] {
    if (isHeatmap(chartType)) {
        return points.filter((point: IHighchartsPointObjectExtended) => !point.ignoredInDrillEventContext);
    }
    return points;
}

export function tickLabelClick(
    drillConfig: IDrillConfig,
    points: IHighchartsPointObjectExtended[],
    target: EventTarget,
    chartType: ChartType,
) {
    tickLabelClickDebounce(drillConfig, points, target, chartType);
}

export function cellClick(drillConfig: IDrillConfig, event: ICellDrillEventExtended, target: EventTarget) {
    const { afm, onFiredDrillEvent } = drillConfig;
    const { columnIndex, rowIndex, row, intersection } = event;

    const drillContext: IDrillEventContextTableExtended = {
        type: VisualizationTypes.TABLE,
        element: "cell",
        columnIndex,
        rowIndex,
        row,
        intersection,
    };
    const data: IDrillEventExtended = {
        executionContext: afm,
        drillContext,
    };

    fireEvent(onFiredDrillEvent, data, target);
}

// TODO: this may be used in final transform
// export function createDrillIntersectionElement(
//     id: string,
//     title: string,
//     uri?: string,
//     identifier?: string,
// ): IDrillEventIntersectionElement {
//     const element: IDrillEventIntersectionElement = {
//         id: id || "",
//         title: title || "",
//     };
//
//     if (uri || identifier) {
//         //        element.header = {
//         //            uri: uri || "",
//         //            identifier: identifier || "",
//         //        };
//     }
//
//     return element;
// }
