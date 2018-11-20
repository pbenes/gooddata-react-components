// (C) 2007-2018 GoodData Corporation
import { AFM, Execution, VisualizationObject } from '@gooddata/typings';
import { IColorAssignment, IColorPalette } from './Config';

export interface IPushData {
    result?: Execution.IExecutionResponses;
    properties?: {
        sortItems?: AFM.SortItem[];
        totals?: VisualizationObject.IVisualizationTotal[];
    };
    propertiesMeta?: any;
    colors?: {
        colorAssignments: IColorAssignment[];
        colorPalette: IColorPalette;
    };
}
