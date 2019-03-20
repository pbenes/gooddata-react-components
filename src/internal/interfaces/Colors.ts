// (C) 2007-2019 GoodData Corporation
import { ChartConfiguration, MappingHeader } from "../../index";
import { IColor, IColorItem } from "@gooddata/gooddata-js";

export interface IColoredItem {
    colorItem: IColorItem;
    color: IColor;
    mappingHeader?: MappingHeader.IMappingHeader;
}

export interface IColorConfiguration {
    colorAssignments: ChartConfiguration.IColorAssignment[];
    colorPalette: ChartConfiguration.IColorPaletteItem[];
}

export interface IColoredItemDropdownItem {
    source: IColoredItem;
}
