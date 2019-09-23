// (C) 2007-2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import Highcharts from "../components/visualizations/chart/highcharts/highchartsEntryPoint";
import { IMappingHeader } from "./MappingHeader";
import {
    ChartElementType,
    ChartType,
    HeadlineElementType,
    HeadlineType,
    TableElementType,
    TableType,
    VisElementType,
    VisType,
} from "../constants/visualizationTypes";
import { TableRowForDrilling } from "./Table";
import { OnFiredDrillEvent } from "./Events";

export interface IDrillableItemUri {
    uri: string;
}

export interface IDrillableItemIdentifier {
    identifier: string;
}

export type IDrillableItem =
    | IDrillableItemUri
    | IDrillableItemIdentifier
    | (IDrillableItemUri & IDrillableItemIdentifier);

export function isDrillableItemUri(item: IDrillableItem): item is IDrillableItemUri {
    return (item as IDrillableItemUri).uri !== undefined;
}

export function isDrillableItemIdentifier(item: IDrillableItem): item is IDrillableItemIdentifier {
    return (item as IDrillableItemIdentifier).identifier !== undefined;
}

export type IDrillEventCallback = (event: IDrillEventExtended) => void | boolean;

// Intersection element
export interface IDrillEventIntersectionElementExtended {
    header: IMappingHeader;
}

// Drill context for tables
export interface IDrillEventContextTableExtended {
    type: TableType;
    element: TableElementType;
    columnIndex: number;
    rowIndex: number;
    row: any[];
    intersection: IDrillEventIntersectionElementExtended[];
}

// Drill context for headline
export interface IDrillEventContextHeadlineExtended {
    type: HeadlineType;
    element: HeadlineElementType;
    value: string;
    intersection: IDrillEventIntersectionElementExtended[];
}

// Drill context for chart
export interface IDrillEventContextPointExtended {
    type: ChartType;
    element: ChartElementType;
    elementChartType?: ChartType;
    x?: number;
    y?: number;
    z?: number;
    value?: string;
    intersection: IDrillEventIntersectionElementExtended[];
}

// Chart series point with intersection element
export interface IDrillPointExtended {
    x: number;
    y: number;
    intersection: IDrillEventIntersectionElementExtended[];
    type?: ChartType;
}

// Drill context for chart element group (multiple series + click on axis value)
// where every point has own intersection
export interface IDrillEventContextGroup {
    type: ChartType;
    element: ChartElementType;
    points: IDrillPointExtended[];
}

// Drill context for all visualization types
export interface IDrillEventContextExtended {
    type: VisType; // type of visualization
    element: VisElementType; // type of visualization element drilled
    x?: number; // chart x coordinate (if supported)
    y?: number; // chart y coordinate (if supported)
    z?: number; // chart z coordinate (if supported)
    columnIndex?: number;
    rowIndex?: number;
    row?: any[]; // table row data of the drilled row
    value?: string; // cell or element value drilled
    // some drill headers that are relevant for current drill element
    intersection?: IDrillEventIntersectionElementExtended[];
    // A collection of chart series points (if available)
    points?: IDrillPointExtended[];
}

// IDrillEvent is a parameter of the onFiredDrillEvent is callback
export interface IDrillEventExtended {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContextExtended;
}

export interface IHighchartsParentTick {
    leaves: number;
    startAt: number;
    label: any;
}

export interface IHighchartsCategoriesTree {
    tick: IHighchartsParentTick;
}

export interface IHighchartsPointObjectExtended extends Highcharts.Point {
    drillIntersection: IDrillEventIntersectionElementExtended[];
    z?: number; // is missing in HCH's interface
    value?: number; // is missing in HCH's interface
}

export function isGroupHighchartsDrillEvent(event: Highcharts.DrilldownEventObject) {
    return !!event.points;
}

export interface ICellDrillEventExtended {
    columnIndex: number;
    rowIndex: number;
    row: TableRowForDrilling;
    intersection: IDrillEventIntersectionElementExtended[];
}

export interface IDrillConfig {
    afm: AFM.IAfm;
    onFiredDrillEvent: OnFiredDrillEvent;
}
