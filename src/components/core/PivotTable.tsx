// (C) 2007-2020 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import {
    BodyScrollEvent,
    ColumnResizedEvent,
    GridApi,
    GridReadyEvent,
    IDatasource,
    SortChangedEvent,
    GridColumnsChangedEvent,
    AgGridEvent,
    ModelUpdatedEvent,
    Column,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { CellClassParams } from "ag-grid-community/dist/lib/entities/colDef";
import * as classNames from "classnames";
import * as CustomEvent from "custom-event";
import * as invariant from "invariant";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";

import "../../../styles/css/pivotTable.css";

import { VisualizationTypes } from "../../constants/visualizationTypes";

import { getScrollbarWidth } from "../../helpers/domUtils";
import {
    convertDrillableItemsToPredicates,
    isSomeHeaderPredicateMatched,
} from "../../helpers/headerPredicate";

import {
    getCellClassNames,
    getMeasureCellFormattedValue,
    getMeasureCellStyle,
} from "../../helpers/tableCell";

import {
    IDrillEvent,
    IDrillEventContextTable,
    IDrillEventContextTableExtended,
    IDrillEventExtended,
    IDrillEventIntersectionElementExtended,
    isDrillEventContextTableExtended,
} from "../../interfaces/DrillEvents";
import { IHeaderPredicate } from "../../interfaces/HeaderPredicate";
import { IMappingHeader, isMappingHeaderAttribute } from "../../interfaces/MappingHeader";
import { IMenuAggregationClickConfig, IPivotTableConfig } from "../../interfaces/PivotTable";
import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { LoadingComponent } from "../simple/LoadingComponent";
import TotalsUtils, {
    AVAILABLE_TOTALS as renderedTotalTypesOrder,
} from "../visualizations/table/totals/utils";

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";

import {
    commonDefaultProps,
    IGetPage,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import { getUpdatedColumnTotals } from "./pivotTable/aggregationsMenuHelper";
import ApiWrapper from "./pivotTable/agGridApiWrapper";
import {
    COLUMN_ATTRIBUTE_COLUMN,
    MEASURE_COLUMN,
    ROW_ATTRIBUTE_COLUMN,
    ROW_TOTAL,
    ROW_SUBTOTAL,
} from "./pivotTable/agGridConst";
import { createAgGridDataSource } from "./pivotTable/agGridDataSource";
import { getDrillRowData, convertDrillIntersectionToLegacy } from "./pivotTable/agGridDrilling";
import { getSortsFromModel, isSortedByFirstAttibute } from "./pivotTable/agGridSorting";
import {
    ICustomGridOptions,
    IGridCellEvent,
    IGridHeader,
    IGridRow,
    ISortModelItem,
} from "./pivotTable/agGridTypes";
import {
    cellRenderer,
    generateAgGridComponentKey,
    getMeasureFormat,
    getRowNodeId,
    getTreeLeaves,
    indexOfTreeNode,
    isMeasureColumnReadyToRender,
} from "./pivotTable/agGridUtils";
import ColumnGroupHeader from "./pivotTable/ColumnGroupHeader";
import ColumnHeader from "./pivotTable/ColumnHeader";
import { GroupingProviderFactory, IGroupingProvider } from "./pivotTable/GroupingProvider";
import { RowLoadingElement } from "./pivotTable/RowLoadingElement";
import {
    initializeStickyRow,
    IScrollPosition,
    stickyRowExists,
    updateStickyRowContentClasses,
    updateStickyRowPosition,
} from "./pivotTable/stickyRowHandler";
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import sumBy = require("lodash/sumBy");
// import debounce = require("lodash/debounce");
import difference = require("lodash/difference");

import { getDrillIntersection } from "../visualizations/utils/drilldownEventing";

export interface IPivotTableProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    totals?: VisualizationObject.IVisualizationTotal[];
    getPage?: IGetPage;
    cancelPagePromises?: () => void;
    pageSize?: number;
    config?: IPivotTableConfig;
    groupRows?: boolean;
    onDataSourceUpdateSuccess?: () => void;
}

export interface IPivotTableState {
    columnDefs: IGridHeader[];
    // rowData an an array of different objects depending on the content of the table.
    rowData: IGridRow[];
    execution: Execution.IExecutionResponses;
    columnTotals: AFM.ITotalItem[];
    agGridRerenderNumber: number;
    desiredHeight: number | undefined;
    sortedByFirstAttribute: boolean;
    resized: number;
}

export type IPivotTableInnerProps = IPivotTableProps &
    ILoadingInjectedProps &
    IDataSourceProviderInjectedProps &
    WrappedComponentProps;

const DEFAULT_ROW_HEIGHT = 28;
const AG_NUMERIC_CELL_CLASSNAME = "ag-numeric-cell";
const AG_NUMERIC_HEADER_CLASSNAME = "ag-numeric-header";

export const WATCHING_TABLE_RENDERED_INTERVAL = 500;
export const WATCHING_TABLE_RENDERED_MAX_TIME = 15000;

/**
 * Pivot Table react component
 */
export class PivotTableInner extends BaseVisualization<IPivotTableInnerProps, IPivotTableState> {
    public static defaultProps: Partial<IPivotTableInnerProps> = {
        ...commonDefaultProps,
        // This prop is optional if you handle nativeTotals through pushData like in appComponents PluggablePivotTable
        updateTotals: noop,
        onDataTooLarge: noop,
        onDataSourceUpdateSuccess: noop,
        pageSize: 100,
        config: {},
        groupRows: true,
    };

    private agGridDataSource: IDatasource;
    private gridApi: GridApi;
    private containerRef: HTMLDivElement;
    private groupingProvider: IGroupingProvider;
    private lastScrollPosition: IScrollPosition = {
        top: 0,
        left: 0,
    };

    private watchingIntervalId: number | null;
    private watchingTimeoutId: number | null;
    private ignoreVirtualColumnsChanged: boolean = false;
    private w: any = 0;
    // private autoresizeColumnsAfterSortChanged: boolean = false;

    constructor(props: IPivotTableInnerProps) {
        super(props);

        this.state = {
            columnDefs: [],
            rowData: [],

            execution: null,
            columnTotals: cloneDeep(TotalsUtils.getColumnTotalsFromResultSpec(this.props.resultSpec)),
            agGridRerenderNumber: 1,
            desiredHeight: props.config.maxHeight,

            sortedByFirstAttribute: true,
            resized: 0, // props.resize === initial ? false : true, TODO: odpodminkovat sirky sloupcu 200? co je v developu
        };

        this.agGridDataSource = null;
        this.gridApi = null;

        this.setGroupingProvider(props.groupRows);
        // this.autoresizeColumns = debounce(this.autoresizeColumns, 50); // long timeout causes jumping of columns when scrolling from right to left
    }

    public componentWillMount() {
        this.createAGGridDataSource();
    }

    public componentDidMount() {
        if (this.containerRef) {
            this.containerRef.addEventListener("mousedown", this.preventHeaderResizerEvents);
        }
    }
    public componentWillUnmount() {
        if (this.containerRef) {
            this.containerRef.removeEventListener("mousedown", this.preventHeaderResizerEvents);
        }
    }

    public componentWillUpdate(nextProps: IPivotTableInnerProps, nextState: IPivotTableState) {
        if (
            this.props.groupRows !== nextProps.groupRows ||
            this.state.sortedByFirstAttribute !== nextState.sortedByFirstAttribute
        ) {
            this.setGroupingProvider(nextProps.groupRows && nextState.sortedByFirstAttribute);
        }
    }

    public componentDidUpdate(prevProps: IPivotTableInnerProps, prevState: IPivotTableState) {
        console.log("didUpdate");
        if (this.w === 0 && this.containerRef) {
            this.w = this.containerRef.clientWidth;
        }
        const wupdated = this.containerRef ? this.containerRef.clientWidth : 0;
        console.log("w", this.w, wupdated);
        const prevPropsTotals = TotalsUtils.getColumnTotalsFromResultSpec(prevProps.resultSpec);
        const currentPropsTotals = TotalsUtils.getColumnTotalsFromResultSpec(this.props.resultSpec);
        const totalsPropsChanged = !isEqual(prevPropsTotals, currentPropsTotals);

        const prevStateTotals = prevState.columnTotals;
        const currentStateTotals = this.state.columnTotals;
        const totalsStateChanged = !isEqual(prevStateTotals, currentStateTotals);

        new Promise(resolve => {
            if (totalsPropsChanged) {
                this.setState(
                    {
                        columnTotals: currentPropsTotals,
                    },
                    resolve,
                );
            } else {
                resolve();
            }
        }).then(() => {
            let agGridDataSourceUpdateNeeded = false;
            if (totalsStateChanged) {
                this.props.updateTotals(this.state.columnTotals);
                agGridDataSourceUpdateNeeded = true;
            }
            if (this.isNewAGGridDataSourceNeeded(prevProps)) {
                this.groupingProvider.reset();
                agGridDataSourceUpdateNeeded = true;
            }
            if (agGridDataSourceUpdateNeeded) {
                this.updateAGGridDataSource();
            }
        });

        if (this.isAgGridRerenderNeeded(this.props, prevProps)) {
            this.forceRerender();
        }
    }

    public renderVisualization() {
        const { desiredHeight } = this.state;
        const gridOptions = this.createGridOptions();

        // columnDefs are loaded with first page request. Show overlay loading before first page is available.
        const tableLoadingOverlay =
            this.state.resized < 2 ? (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        right: 0,
                        background: "white",
                    }}
                >
                    <LoadingComponent />
                </div>
            ) : null;

        const style: React.CSSProperties = {
            height: desiredHeight || "100%",
            position: "relative",
            overflow: "hidden",
        };

        return (
            <div className="gd-table-component" style={style}>
                <div
                    className="gd-table ag-theme-balham s-pivot-table"
                    style={style}
                    ref={this.setContainerRef}
                >
                    <AgGridReact
                        // debug={true}
                        {...gridOptions}
                        // To force Ag grid rerender because AFAIK there is no way
                        // to tell Ag grid header cell to rerender
                        key={generateAgGridComponentKey(
                            this.props.dataSource.getAfm(),
                            this.state.agGridRerenderNumber,
                        )}
                    />
                    {tableLoadingOverlay}
                </div>
            </div>
        );
    }

    //
    //
    //

    private isTableHidden() {
        return this.state.columnDefs.length === 0;
    }

    private forceRerender() {
        this.setState(state => ({
            agGridRerenderNumber: state.agGridRerenderNumber + 1,
        }));
    }

    //
    // getters / setters / manipulators
    //

    private setContainerRef = (container: HTMLDivElement): void => {
        this.containerRef = container;
    };

    private setGroupingProvider = (sortedByFirstAttr: boolean) => {
        this.groupingProvider = GroupingProviderFactory.createProvider(sortedByFirstAttr);
    };

    private updateGrouping = (): void => {
        this.setGroupingProvider(this.props.groupRows && this.state.sortedByFirstAttribute);
    };

    private getExecutionResponse = () => {
        return this.state.execution ? this.state.execution.executionResponse : null;
    };

    private getColumnTotals = () => {
        return this.state.columnTotals;
    };

    private getExecution = () => {
        return this.state.execution;
    };

    private getGridApi = () => this.gridApi;

    //
    // working with data source
    //

    private isNewAGGridDataSourceNeeded(prevProps: IPivotTableInnerProps): boolean {
        // cannot compare dataSource using deep equal as it stores execution promises that almost always differ
        const dataSourceChanged =
            this.props.dataSource.getFingerprint() !== prevProps.dataSource.getFingerprint();

        const dataSourceInvalidatingPropNames = [
            "resultSpec",
            "getPage",
            // drillable items need fresh execution because drillable context for row attribute is kept in rowData
            // It could be refactored to assign drillability without execution,
            // but it would suffer a significant performance hit
            "drillableItems",
        ];

        const dataSourceInvalidatingPropChanged = dataSourceInvalidatingPropNames.some(
            propKey => !isEqual(this.props[propKey], prevProps[propKey]),
        );

        return dataSourceChanged || dataSourceInvalidatingPropChanged;
    }

    private isAgGridRerenderNeeded(props: IPivotTableInnerProps, prevProps: IPivotTableInnerProps): boolean {
        const propsRequiringAgGridRerender = [["config", "menu"]];
        return propsRequiringAgGridRerender.some(
            propKey => !isEqual(get(props, propKey), get(prevProps, propKey)),
        );
    }

    private updateAGGridDataSource(): void {
        console.log("updateAGGridDataSource");
        this.createAGGridDataSource();
        this.setGridDataSource();
    }

    private createAGGridDataSource() {
        const onSuccess = (
            execution: Execution.IExecutionResponses,
            columnDefs: IGridHeader[],
            resultSpec: AFM.IResultSpec,
        ) => {
            if (!isEqual(columnDefs, this.state.columnDefs)) {
                const sortedByFirstAttribute = isSortedByFirstAttibute(columnDefs, resultSpec);
                this.setState({
                    columnDefs,
                    sortedByFirstAttribute,
                });
            }
            if (!isEqual(execution, this.state.execution)) {
                this.setState({
                    execution,
                });
            }
            this.updateDesiredHeight(execution.executionResult);
            this.props.onDataSourceUpdateSuccess();
            console.log("onSuccess");
        };

        this.agGridDataSource = createAgGridDataSource(
            this.props.resultSpec,
            this.props.getPage,
            this.getExecution,
            onSuccess,
            this.getGridApi,
            this.props.intl,
            this.state.columnTotals,
            () => this.groupingProvider,
            this.props.cancelPagePromises,
        );
    }

    private setGridDataSource() {
        this.setState({ execution: null });
        if (this.gridApi) {
            this.gridApi.setDatasource(this.agGridDataSource);
        }
    }

    private getColumnIdsToAutoresize = (columns: Column[]): string[] =>
        columns.filter((column: any) => !column.width).map((column: Column) => column.getColId());

    private autoresizeColumns = (event: AgGridEvent, force: boolean = false) => {
        if (this.state.resized > 1 && !force) {
            return;
        }

        const updatedNumber = this.state.resized + 1;
        this.setState({
            resized: updatedNumber,
        });

        let autoWidthColumnIds: string[] = [];
        // getAllDisplayedVirtualColumns together with debounce has issue with jumping of columns when scrolling from right to the left
        // needs to be compared with getAll(Displayed)Columns + debounce what is more effective
        let displayedVirtualColumns = event.columnApi.getAllDisplayedVirtualColumns();
        autoWidthColumnIds = this.getColumnIdsToAutoresize(displayedVirtualColumns);
        console.log("autosizing: ", JSON.stringify(autoWidthColumnIds), displayedVirtualColumns);
        // do some diff of ids from previous run?
        event.columnApi.autoSizeColumns(autoWidthColumnIds);
        // handle newly shown columns if some
        let displayedVirtualColumnsAfterResize = event.columnApi.getAllDisplayedVirtualColumns();
        while (displayedVirtualColumnsAfterResize > displayedVirtualColumns) {
            const newColumns = difference(displayedVirtualColumnsAfterResize, displayedVirtualColumns);
            autoWidthColumnIds = this.getColumnIdsToAutoresize(newColumns);
            displayedVirtualColumns = displayedVirtualColumnsAfterResize;
            console.log("autoresize recursion: ", autoWidthColumnIds, newColumns);
            event.columnApi.autoSizeColumns(autoWidthColumnIds);
            displayedVirtualColumnsAfterResize = event.columnApi.getAllDisplayedVirtualColumns();
        }
    };

    //
    // event handlers
    //

    private onGridReady = (params: GridReadyEvent) => {
        console.log("onGridReady");
        this.gridApi = params.api;
        this.setGridDataSource();

        if (this.props.groupRows) {
            initializeStickyRow(this.gridApi);
        }
    };

    private onGridColumnsChanged = (_event: GridColumnsChangedEvent) => {
        console.log("gridColumnsChanged");
    };

    private onVirtualColumnsChanged = (event: GridColumnsChangedEvent) => {
        console.log("onVirtualColumnsChanged with ignore: ", this.ignoreVirtualColumnsChanged);
        const wupdated = this.containerRef ? this.containerRef.clientWidth : 0;
        if (this.w !== wupdated) {
            this.w = wupdated;
            console.log("autoresize called");
            this.autoresizeColumns(event, true); // handles horizontal scrolling
        }
    };

    private rowDataChanged = () => {
        console.log("rowDataChanged");
    };

    private onColumnEverythingChanged = () => {
        console.log("onColumnEverythingChanged");
    };

    private startWatchingTableRendered = () => {
        const missingContainerRef = !this.containerRef; // table having no data will be unmounted, it causes ref null
        const isTableVisible = !this.isTableHidden(); // table has data and takes place of Loading icon
        if (missingContainerRef || isTableVisible) {
            this.stopWatchingTableRendered();
        }
    };

    private stopWatchingTableRendered = () => {
        clearInterval(this.watchingIntervalId);
        this.watchingIntervalId = null;

        clearTimeout(this.watchingTimeoutId);
        this.watchingTimeoutId = null;

        this.props.afterRender();
    };

    private onFirstDataRendered = () => {
        // Since issue here is not resolved, https://github.com/ag-grid/ag-grid/issues/3263,
        // work-around by using 'setInterval'
        this.watchingIntervalId = window.setInterval(
            this.startWatchingTableRendered,
            WATCHING_TABLE_RENDERED_INTERVAL,
        );

        // after 15s, this table might or not (due to long backend execution) be rendered
        // either way, 'afterRender' should be called to notify to KPI dashboard
        // if KPI dashboard is in export mode, its content could be exported as much as possible even without this table
        this.watchingTimeoutId = window.setTimeout(
            this.stopWatchingTableRendered,
            WATCHING_TABLE_RENDERED_MAX_TIME,
        );
        console.log("onFirstDataRendered");
    };

    private onModelUpdated = (event: ModelUpdatedEvent) => {
        console.log("modelUpdated");
        this.updateStickyRow();
        if (this.state.execution) {
            this.autoresizeColumns(event);
        }
        // handles change of model after sort change only
        // without this condition it would cause change of column width during vertical scrolling
        // if (this.autoresizeColumnsAfterSortChanged) {
        //     this.autoresizeColumnsAfterSortChanged = false;
        //     this.autoresizeColumns(event);
        // }
    };

    private getAttributeHeader(colId: string, columnDefs: IGridHeader[]): Execution.IAttributeHeader {
        const matchingColDef: IGridHeader = columnDefs.find(
            (columnDef: IGridHeader) => columnDef.field === colId,
        );
        if (matchingColDef && matchingColDef.drillItems.length === 1) {
            const drillItemHeader = matchingColDef.drillItems[0];
            if (isMappingHeaderAttribute(drillItemHeader)) {
                return drillItemHeader;
            }
        }
        return null;
    }

    private getItemAndAttributeHeaders = (
        attributeItemHeaders: { [colId: string]: IMappingHeader },
        columnDefs: IGridHeader[],
    ): IMappingHeader[] => {
        return Object.keys(attributeItemHeaders).reduce((headers: IMappingHeader[], colId: string) => {
            const attributeHeader = this.getAttributeHeader(colId, columnDefs);
            if (attributeHeader) {
                headers.push(attributeItemHeaders[colId]);
                headers.push(attributeHeader);
            }
            return headers;
        }, []);
    };

    private getAttributeDrillItemsForMeasureDrill = (
        cellEvent: IGridCellEvent,
        columnDefs: IGridHeader[],
    ): IMappingHeader[] => {
        const rowDrillItems = get(cellEvent, ["data", "headerItemMap"]);
        return this.getItemAndAttributeHeaders(rowDrillItems, columnDefs);
    };

    private isSomeTotal = (rowType: string) => {
        const isRowTotal = rowType === ROW_TOTAL;
        const isRowSubtotal = rowType === ROW_SUBTOTAL;
        return isRowTotal || isRowSubtotal;
    };

    private getRowDrillItem = (cellEvent: IGridCellEvent) =>
        get(cellEvent, ["data", "headerItemMap", cellEvent.colDef.field]);

    private getDrillItems = (cellEvent: IGridCellEvent): IMappingHeader[] => {
        const { colDef } = cellEvent;
        const rowDrillItem = this.getRowDrillItem(cellEvent);
        return rowDrillItem ? [rowDrillItem, ...colDef.drillItems] : colDef.drillItems;
    };

    private getDrillIntersection = (
        cellEvent: IGridCellEvent,
        drillItems: IMappingHeader[],
        columnDefs: IGridHeader[],
    ): IDrillEventIntersectionElementExtended[] => {
        const rowDrillItem = this.getRowDrillItem(cellEvent);
        const completeDrillItems: IMappingHeader[] = rowDrillItem
            ? drillItems
            : [...drillItems, ...this.getAttributeDrillItemsForMeasureDrill(cellEvent, columnDefs)];
        return getDrillIntersection(completeDrillItems);
    };

    private cellClicked = (cellEvent: IGridCellEvent) => {
        const {
            onDrill,
            execution: { executionResponse },
        } = this.props;
        const { columnDefs } = this.state;
        const afm: AFM.IAfm = this.props.dataSource.getAfm();
        const drillablePredicates = this.getDrillablePredicates();

        const { colDef, rowIndex } = cellEvent;

        const rowType = get(cellEvent, ["data", "type"], "");

        if (this.isSomeTotal(rowType)) {
            return false;
        }

        const drillItems: IMappingHeader[] = this.getDrillItems(cellEvent);

        const drillableHeaders = drillItems.filter((drillItem: IMappingHeader) =>
            isSomeHeaderPredicateMatched(drillablePredicates, drillItem, afm, executionResponse),
        );

        if (drillableHeaders.length === 0) {
            return false;
        }

        const leafColumnDefs = getTreeLeaves(columnDefs);
        const columnIndex = leafColumnDefs.findIndex(gridHeader => gridHeader.field === colDef.field);
        const row = getDrillRowData(leafColumnDefs, cellEvent.data);

        const intersection = this.getDrillIntersection(cellEvent, drillItems, columnDefs);

        const drillContextExtended: IDrillEventContextTableExtended = {
            type: VisualizationTypes.TABLE,
            element: "cell",
            columnIndex,
            rowIndex,
            row,
            intersection,
        };
        const drillEventExtended: IDrillEventExtended = {
            executionContext: afm,
            drillContext: drillContextExtended,
        };

        if (onDrill) {
            onDrill(drillEventExtended);
        }

        return this.handleLegacyOnFireDrillEvent(drillEventExtended, cellEvent);
    };

    private handleLegacyOnFireDrillEvent = (
        drillEventExtended: IDrillEventExtended,
        cellEvent: IGridCellEvent,
    ): boolean => {
        const { onFiredDrillEvent } = this.props;
        const { executionContext, drillContext } = drillEventExtended;
        // this type guard is here only for casting because drillContext came from event as IDrillEventContextExtended
        if (isDrillEventContextTableExtended(drillContext)) {
            // Old drill event for backward compatibility
            const drillContextLegacy: IDrillEventContextTable = {
                ...drillContext,
                intersection: convertDrillIntersectionToLegacy(drillContext.intersection, executionContext),
            };
            const drillEvent: IDrillEvent = {
                executionContext,
                drillContext: drillContextLegacy,
            };

            if (onFiredDrillEvent(drillEvent)) {
                // This is needed for /analyze/embedded/ drilling with post message
                // tslint:disable-next-line:max-line-length
                // More info: https://github.com/gooddata/gdc-analytical-designer/blob/develop/test/drillEventing/drillEventing_page.html
                const event = new CustomEvent("drill", {
                    detail: drillEvent,
                    bubbles: true,
                });
                cellEvent.event.target.dispatchEvent(event);
                return true;
            }
        }
        return false;
    };

    private columnResized = (columnEvent: ColumnResizedEvent) => {
        if (!columnEvent.finished) {
            this.ignoreVirtualColumnsChanged = true;
            return; // only update the height once the user is done setting the column size
        }
        this.ignoreVirtualColumnsChanged = false;
        this.updateDesiredHeight(this.state.execution.executionResult);
    };

    private onMenuAggregationClick = (menuAggregationClickConfig: IMenuAggregationClickConfig) => {
        const newColumnTotals = getUpdatedColumnTotals(this.getColumnTotals(), menuAggregationClickConfig);

        this.props.pushData({
            properties: {
                totals: newColumnTotals,
            },
        });
        this.setState({ columnTotals: newColumnTotals });

        this.updateGrouping();
    };

    private sortChanged = (event: SortChangedEvent): void => {
        const execution = this.getExecution();

        invariant(execution !== undefined, "changing sorts without prior execution cannot work");

        const sortModel: ISortModelItem[] = event.columnApi
            .getAllColumns()
            .filter(col => col.getSort() !== undefined && col.getSort() !== null)
            .map(col => ({
                colId: col.getColDef().field,
                sort: col.getSort() as AFM.SortDirection,
            }));

        const sortItems = getSortsFromModel(sortModel, execution);

        this.props.pushData({
            properties: {
                sortItems,
            },
        });

        this.updateGrouping();
        console.log("sort changed");
        // this.autoresizeColumnsAfterSortChanged = true;
        // this.autoresizeColumns(event); // calling autoresize here is too soon
    };

    private onBodyScroll = (event: BodyScrollEvent) => {
        const scrollPosition: IScrollPosition = {
            top: Math.max(event.top, 0),
            left: event.left,
        };
        this.updateStickyRowContent(scrollPosition);
    };

    private preventHeaderResizerEvents = (event: Event) => {
        if (event.target && this.isHeaderResizer(event.target as HTMLElement)) {
            event.stopPropagation();
        }
    };

    //
    // grid options & styling
    //

    private createGridOptions = (): ICustomGridOptions => {
        const { columnDefs, rowData } = this.state;
        const { pageSize } = this.props;

        const separators = get(this.props, ["config", "separators"], undefined);
        const menu = get(this.props, ["config", "menu"]);

        const commonHeaderComponentParams = {
            onMenuAggregationClick: this.onMenuAggregationClick,
            getExecutionResponse: this.getExecutionResponse,
            getColumnTotals: this.getColumnTotals,
            intl: this.props.intl,
        };

        return {
            // Initial data
            columnDefs,
            rowData,
            defaultColDef: {
                cellClass: this.getCellClass(null),
                headerComponentFramework: ColumnHeader as any,
                headerComponentParams: {
                    menu,
                    enableSorting: true,
                    ...commonHeaderComponentParams,
                },
                minWidth: 50,
                sortable: true,
                resizable: true,
            },
            defaultColGroupDef: {
                headerClass: this.getHeaderClass(null),
                children: [],
                headerGroupComponentFramework: ColumnGroupHeader as any,
                headerGroupComponentParams: {
                    menu,
                    ...commonHeaderComponentParams,
                },
            },
            onCellClicked: this.cellClicked,
            onSortChanged: this.sortChanged,
            onColumnResized: this.columnResized,

            // Basic options
            suppressMovableColumns: true,
            suppressCellSelection: true,
            enableFilter: false,

            // infinite scrolling model
            rowModelType: "infinite",
            paginationPageSize: pageSize,
            cacheOverflowSize: pageSize,
            cacheBlockSize: pageSize,
            maxConcurrentDatasourceRequests: 1,
            infiniteInitialRowCount: pageSize,
            maxBlocksInCache: 10,
            // suppressColumnVirtualisation: true, // TODO INE when turned on, it solves issues with horizontal scrollbar jumping
            onGridReady: this.onGridReady,
            onFirstDataRendered: this.onFirstDataRendered,
            onGridColumnsChanged: this.onGridColumnsChanged,
            onVirtualColumnsChanged: this.onVirtualColumnsChanged,
            onModelUpdated: this.onModelUpdated,
            onBodyScroll: this.onBodyScroll,
            onRowDataChanged: this.rowDataChanged,
            // animationQueueEmpty: this.animationQueueEmpty,
            onColumnEverythingChanged: this.onColumnEverythingChanged,

            // this provides persistent row selection (if enabled)
            getRowNodeId,

            // Column types
            columnTypes: {
                [ROW_ATTRIBUTE_COLUMN]: {
                    cellClass: this.getCellClass("gd-row-attribute-column"),
                    headerClass: this.getHeaderClass("gd-row-attribute-column-header"),
                    colSpan: params => {
                        if (
                            // params.data is undefined when rows are in loading state
                            params.data &&
                            params.data.colSpan &&
                            renderedTotalTypesOrder.find(
                                (item: string) => item === params.data[params.data.colSpan.headerKey],
                            )
                        ) {
                            return params.data.colSpan.count;
                        }
                        return 1;
                    },
                    valueFormatter: params => {
                        return params.value === undefined ? null : params.value;
                    },
                    cellRenderer,
                },
                [COLUMN_ATTRIBUTE_COLUMN]: {
                    cellClass: this.getCellClass("gd-column-attribute-column"),
                    headerClass: this.getHeaderClass("gd-column-attribute-column-header"),
                },
                [MEASURE_COLUMN]: {
                    cellClass: this.getCellClass(classNames(AG_NUMERIC_CELL_CLASSNAME, "gd-measure-column")),
                    headerClass: this.getHeaderClass(
                        classNames(AG_NUMERIC_HEADER_CLASSNAME, "gd-measure-column-header"),
                    ),
                    // wrong params type from ag-grid, we need any
                    valueFormatter: (params: any) => {
                        return isMeasureColumnReadyToRender(params, this.state.execution)
                            ? getMeasureCellFormattedValue(
                                  params.value,
                                  getMeasureFormat(params.colDef, this.state.execution),
                                  separators,
                              )
                            : null;
                    },
                    cellStyle: params => {
                        return isMeasureColumnReadyToRender(params, this.state.execution)
                            ? getMeasureCellStyle(
                                  params.value,
                                  getMeasureFormat(params.colDef, this.state.execution),
                                  separators,
                                  true,
                              )
                            : null;
                    },
                    cellRenderer,
                },
            },

            // Custom renderers
            frameworkComponents: {
                // any is needed here because of incompatible types with AgGridReact types
                loadingRenderer: RowLoadingElement as any, // loading indicator
            },

            // Custom CSS classes
            rowClass: "gd-table-row",
            rowHeight: DEFAULT_ROW_HEIGHT,
            autoSizePadding: 10,
        };
    };

    /**
     * getCellClass returns class for drillable cells. (maybe format in the future as well)
     */
    private getCellClass = (classList: string) => (cellClassParams: CellClassParams): string => {
        const {
            dataSource,
            execution: { executionResponse },
        } = this.props;
        const { rowIndex } = cellClassParams;
        const colDef = cellClassParams.colDef as IGridHeader;
        const drillablePredicates = this.getDrillablePredicates();
        // return none if no drillableItems are specified

        const afm: AFM.IAfm = dataSource.getAfm();

        let hasDrillableHeader = false;

        const rowType = get(cellClassParams, ["data", "type"], "");
        const isRowTotal = rowType === ROW_TOTAL;
        const isRowSubtotal = rowType === ROW_SUBTOTAL;

        if (drillablePredicates.length !== 0 && !isRowTotal && !isRowSubtotal) {
            const rowDrillItem = get(cellClassParams, ["data", "headerItemMap", colDef.field]);
            const headers: IMappingHeader[] = rowDrillItem
                ? [...colDef.drillItems, rowDrillItem]
                : colDef.drillItems;

            hasDrillableHeader = headers.some((drillItem: IMappingHeader) =>
                isSomeHeaderPredicateMatched(drillablePredicates, drillItem, afm, executionResponse),
            );
        }

        const attributeId = colDef.field;
        const isPinnedRow = cellClassParams.node.isRowPinned();
        const hiddenCell = !isPinnedRow && this.groupingProvider.isRepeatedValue(attributeId, rowIndex);
        const rowSeparator = !hiddenCell && this.groupingProvider.isGroupBoundary(rowIndex);
        const subtotalStyle = get(cellClassParams, ["data", "subtotalStyle"]);

        return classNames(
            classList,
            getCellClassNames(rowIndex, colDef.index, hasDrillableHeader),
            colDef.index !== undefined ? `gd-column-index-${colDef.index}` : null,
            colDef.measureIndex !== undefined ? `gd-column-measure-${colDef.measureIndex}` : null,
            isRowTotal ? "gd-row-total" : null,
            subtotalStyle ? `gd-table-row-subtotal gd-table-row-subtotal-${subtotalStyle}` : null,
            hiddenCell ? "gd-cell-hide s-gd-cell-hide" : null,
            rowSeparator ? "gd-table-row-separator s-gd-table-row-separator" : null,
        );
    };

    private getHeaderClass = (classList: string) => (headerClassParams: any): string => {
        const colDef: IGridHeader = headerClassParams.colDef;
        const { field, measureIndex } = colDef;
        const treeIndexes = colDef
            ? indexOfTreeNode(
                  colDef,
                  this.state.columnDefs,
                  (nodeA, nodeB) => nodeA.field !== undefined && nodeA.field === nodeB.field,
              )
            : null;
        const colGroupIndex = treeIndexes ? treeIndexes[treeIndexes.length - 1] : null;
        const isFirstColumn = treeIndexes !== null && !treeIndexes.some(index => index !== 0);

        return classNames(
            classList,
            "gd-column-group-header",
            colGroupIndex !== null ? `gd-column-group-header-${colGroupIndex}` : null,
            colGroupIndex !== null ? `s-table-measure-column-header-group-cell-${colGroupIndex}` : null,
            measureIndex !== null ? `s-table-measure-column-header-cell-${measureIndex}` : null,
            !field ? "gd-column-group-header--empty" : null,
            isFirstColumn ? "gd-column-group-header--first" : null,
        );
    };

    //
    // misc :)
    //

    private getDrillablePredicates(): IHeaderPredicate[] {
        return convertDrillableItemsToPredicates(this.props.drillableItems);
    }

    private isStickyRowAvailable(): boolean {
        const gridApi = this.getGridApi();
        return this.props.groupRows && gridApi && stickyRowExists(gridApi);
    }

    private updateStickyRow(): void {
        if (this.isStickyRowAvailable()) {
            updateStickyRowPosition(this.getGridApi());

            const scrollPosition: IScrollPosition = { ...this.lastScrollPosition };
            this.lastScrollPosition = {
                top: 0,
                left: 0,
            };

            this.updateStickyRowContent(scrollPosition);
        }
    }

    private updateStickyRowContent(scrollPosition: IScrollPosition): void {
        if (this.isStickyRowAvailable()) {
            updateStickyRowContentClasses(
                scrollPosition,
                this.lastScrollPosition,
                DEFAULT_ROW_HEIGHT,
                this.getGridApi(),
                this.groupingProvider,
                ApiWrapper,
            );
        }

        this.lastScrollPosition = { ...scrollPosition };
    }

    private getTotalBodyHeight(executionResult: Execution.IExecutionResult): number {
        const aggregationCount = sumBy(executionResult.totals, total => total.length);
        const rowCount = executionResult.paging.total[0];

        const headerHeight = ApiWrapper.getHeaderHeight(this.gridApi);

        // add small room for error to avoid scrollbars that scroll one, two pixels
        // increased in order to resolve issue BB-1509
        const leeway = 2;

        const bodyHeight = rowCount * DEFAULT_ROW_HEIGHT + leeway;
        const footerHeight = aggregationCount * DEFAULT_ROW_HEIGHT;

        return headerHeight + bodyHeight + footerHeight;
    }

    private getScrollBarPadding(): number {
        if (!this.gridApi) {
            return 0;
        }
        const actualWidth = this.containerRef && this.containerRef.scrollWidth;
        const preferredWidth = this.gridApi.getPreferredWidth();
        const hasHorizontalScrollBar = actualWidth < preferredWidth;
        return hasHorizontalScrollBar ? getScrollbarWidth() : 0;
    }

    private updateDesiredHeight(executionResult: Execution.IExecutionResult): void {
        const { maxHeight } = this.props.config;
        if (!maxHeight) {
            return;
        }

        const totalHeight = this.getTotalBodyHeight(executionResult) + this.getScrollBarPadding();
        const desiredHeight = Math.min(totalHeight, maxHeight);

        if (this.state.desiredHeight !== desiredHeight) {
            this.setState({ desiredHeight });
        }
    }

    private isHeaderResizer(target: HTMLElement) {
        return target.classList.contains("ag-header-cell-resize");
    }
}

export const PivotTable = visualizationLoadingHOC(PivotTableInner, false);
