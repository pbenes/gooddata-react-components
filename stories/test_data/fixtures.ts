// (C) 2007-2020 GoodData Corporation
import { range, cloneDeep } from "lodash";
import { VisualizationObject } from "@gooddata/typings";

import { immutableSet, repeatItemsNTimes } from "../../src/components/visualizations/utils/common";
import { STACK_BY_DIMENSION_INDEX } from "../../src/components/visualizations/chart/constants";

export const barChartWithSingleMeasureAndNoAttributes: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_single_measure_and_no_attributes_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_single_measure_and_no_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_single_measure_and_no_attributes_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWithoutAttributes: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_without_attributes_request.ts")(projectId).execution,
    executionResponse: require("../test_data/bar_chart_without_attributes_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_without_attributes_result.ts")(projectId)
        .executionResult,
});

export const barChartWithNegativeAndZeroValues: any = (projectId: string) =>
    immutableSet(barChartWithoutAttributes(projectId), "executionResult.data", [["-116625456.54"], ["0"]]);

export const barChartWith3MetricsAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWith2MetricsAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWith4MetricsAndViewBy2Attribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWith4MetricsAndViewBy2AttributeAndSomeNullDataPoint: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_with_some_null_datapoints_result.ts")(
        projectId,
    ).executionResult,
});

export const chartWithTwoAttributesAndSomeNullDatapoints: any = (projectId: string) => ({
    executionRequest: require("../test_data/chart_with_2_attributes_and_null_datapoints_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/chart_with_2_attributes_and_null_datapoints_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/chart_with_2_attributes_and_null_datapoints_result.ts")(projectId)
        .executionResult,
});

export const scatterPlotWith2MetricsAndAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/scatter_plot_with_2_metrics_and_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/scatter_plot_with_2_metrics_and_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/scatter_plot_with_2_metrics_and_attribute_result.ts")(projectId)
        .executionResult,
    mdObject: require("../test_data/scatter_plot_with_2_metrics_and_attribute_md.ts")(projectId),
});

export const scatterWithNulls = (projectId: string) => ({
    ...scatterPlotWith2MetricsAndAttribute,
    executionResult: require("../test_data/scatter_plot_with_nulls_result.ts")(projectId).executionResult,
});

export const bubbleChartWith3MetricsAndAttributeMd: any = (projectId: string) => ({
    mdObject: require("../test_data/bubble_chart_with_3_metrics_and_attribute_md.ts")(projectId),
});

export const bubbleChartWith3MetricsAndAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_and_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_and_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_and_attribute_result.ts")(projectId)
        .executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd,
});

export const bubbleChartWith3MetricsMd: any = (projectId: string) => ({
    mdObject: require("../test_data/bubble_chart_with_3_metrics_md.ts")(projectId),
});

export const bubbleChartWith3AMMetricsAndAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_result.ts")(projectId)
        .executionResult,
    mdObject: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_md.ts")(projectId),
});

export const bubbleChartWith3Metrics: any = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_request.ts")(projectId).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_result.ts")(projectId).executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd,
});

export const bubbleChartWithNulls = (projectId: string) => ({
    ...bubbleChartWith3MetricsAndAttribute,
    ...bubbleChartWith3MetricsAndAttributeMd,
    executionResult: require("../test_data/bubble_chart_with_nulls_result.ts")(projectId).executionResult,
});

export const areaChartWith3MetricsAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_result.ts")(
        projectId,
    ).executionResult,
});

export const areaChartWith1MetricsAndStackByAttributeAndFilters: any = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_result.ts")(
        projectId,
    ).executionResult,
});

export const areaChartWithNegativeValues: any = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_negative_values_request.ts")(projectId).execution,
    executionResponse: require("../test_data/area_chart_with_negative_values_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/area_chart_with_negative_values_result.ts")(projectId)
        .executionResult,
});

export const areaChartWithMeasureViewByAndStackBy: any = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_measure_view_by_and_stack_by_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_measure_view_by_and_stack_by_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_measure_view_by_and_stack_by_result.ts")(projectId)
        .executionResult,
});

export const barChartWithViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_view_by_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_view_by_attribute_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_with_view_by_attribute_result.ts")(projectId)
        .executionResult,
});

export const barChartWithManyViewByAttributeValues: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_many_view_by_attribute_values_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_many_view_by_attribute_values_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_many_view_by_attribute_values_result.ts")(projectId)
        .executionResult,
});

export const barChartWithStackByAndViewByAttributes: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWithStackByAndOnlyOneStack: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_result.ts")(projectId)
        .executionResult,
});

export const barChartWithPopMeasureAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_result.ts")(
        projectId,
    ).executionResult,
});

export const barChartWithPreviousPeriodMeasure: any = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_previous_period_measure_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_previous_period_measure_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_with_previous_period_measure_result.ts")(projectId)
        .executionResult,
});

export const columnChartWithMeasureViewByAndComputeRatio: any = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_result.ts")(
        projectId,
    ).executionResult,
});

export const columnChartWithMeasureViewBy: any = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_result.ts")(projectId)
        .executionResult,
});

export const columnChartWithMeasureViewBy2AttributesAndComputeRatio: any = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_result.ts")(
        projectId,
    ).executionResult,
});

export const columnChartWithMeasureViewBy2Attributes: any = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_result.ts")(
        projectId,
    ).executionResult,
});

export const pieChartWithMetricsOnly: any = (projectId: string) => ({
    executionRequest: require("../test_data/pie_chart_with_metrics_only_request.ts")(projectId).execution,
    executionResponse: require("../test_data/pie_chart_with_metrics_only_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/pie_chart_with_metrics_only_result.ts")(projectId).executionResult,
});

export const headlineWithOneMeasure: any = (projectId: string) => ({
    executionRequest: require("../test_data/headline_with_one_measure_request.ts")(projectId).execution,
    executionResponse: require("../test_data/headline_with_one_measure_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/headline_with_one_measure_result.ts")(projectId).executionResult,
});

export const headlineWithTwoMeasures: any = (projectId: string) => ({
    executionRequest: require("../test_data/headline_with_two_measures_request.ts")(projectId).execution,
    executionResponse: require("../test_data/headline_with_two_measures_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/headline_with_two_measures_result.ts")(projectId).executionResult,
});

export const pivotTableWithColumnAndRowAttributes: any = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_column_and_row_attributes_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/pivot_table_with_column_and_row_attributes_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_and_row_attributes_result.ts")(projectId)
        .executionResult,
});

export const pivotTableWithColumnRowAttributesAndTotals: any = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_column_row_attributes_and_totals_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/pivot_table_with_column_row_attributes_and_totals_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_row_attributes_and_totals_result.ts")(
        projectId,
    ).executionResult,
});

export const pivotTableWithSubtotals: any = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_subtotals_request.ts")(projectId).execution,
    executionResponse: require("../test_data/pivot_table_with_subtotals_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/pivot_table_with_subtotals_result.ts")(projectId).executionResult,
});

export const comboWithTwoMeasuresAndViewByAttribute = barChartWith2MetricsAndViewByAttribute;
export const comboWithTwoMeasuresAndViewByAttributeMdObject: (
    projectId: string,
) => VisualizationObject.IVisualizationObjectContent = (projectId: string) => ({
    buckets: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.ts")(projectId)
        .buckets,
    filters: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.ts")(projectId)
        .buckets,
    visualizationClass: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.ts")(
        projectId,
    ).buckets,
});

export const comboWithThreeMeasuresAndViewByAttribute = barChartWith3MetricsAndViewByAttribute;
export const comboWithThreeMeasuresAndViewByAttributeMdObject: (
    projectId: string,
) => VisualizationObject.IVisualizationObjectContent = (projectId: string) => ({
    buckets: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.ts")(projectId)
        .buckets,
    visualizationClass: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.ts")(
        projectId,
    ).visualizationClass,
});

export const tableWithSorting: any = (projectId: string) => ({
    executionRequest: require("../test_data/table_with_sort_request.ts")(projectId).execution,
    executionResponse: require("../test_data/table_with_sort_response.ts")(projectId).executionResponse,
    executionResult: require("../test_data/table_with_sort_result.ts")(projectId).executionResult,
});

export const treemapWithMetricAndViewByAttributeMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_and_view_by_attribute_md.ts")(projectId),
});

export const treemapWithMetricAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_attribute_result.ts")(projectId)
        .executionResult,
    ...treemapWithMetricAndViewByAttributeMd,
});

export const treemapWithMetricAndViewByAndOnlyOneElement: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_and_only_one_element_result.ts")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricAndViewByAttributeMd,
});

export const treemapWithMetricAndStackByAttributeMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_and_stack_by_attribute_md.ts")(projectId),
});

export const treemapWithMetricAndStackByAttribute: any = (projectId: string) => ({
    ...treemapWithMetricAndViewByAttribute(projectId), // execution is the same
    ...treemapWithMetricAndStackByAttributeMd(projectId),
});

export const treemapWithMetricViewByAndStackByAttributeMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_md.ts")(projectId),
});

export const treemapWithMetricViewByAndStackByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_result.ts")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricViewByAndStackByAttributeMd,
});

export const treemapWithTwoMetricsAndStackByAttributeMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_md.ts")(projectId),
});

export const treemapWithTwoMetricsAndStackByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_request.ts")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_response.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_result.ts")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithTwoMetricsAndStackByAttributeMd,
});

export const treemapWithThreeMetricsMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_three_metrics_md.ts")(projectId),
});

export const treemapWithThreeMetrics: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_three_metrics_request.ts")(projectId).execution,
    executionResponse: require("../test_data/treemap_with_three_metrics_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/treemap_with_three_metrics_result.ts")(projectId).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithThreeMetricsMd,
});

export const treemapWithOneMetricMd: any = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_one_metric_md.ts")(projectId),
});

export const treemapWithOneMetric: any = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_one_metric_request.ts")(projectId).execution,
    executionResponse: require("../test_data/treemap_with_one_metric_response.ts")(projectId)
        .executionResponse,
    executionResult: require("../test_data/treemap_with_one_metric_result.ts")(projectId).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithOneMetricMd,
});

export const chartWith20MetricsAndViewByAttribute: any = (projectId: string) => ({
    executionRequest: require("../test_data/chart_with_20_metric_and_view_by_attribute_request.ts")(projectId)
        .execution,
    executionResponse: require("../test_data/chart_with_20_metric_and_view_by_attribute_reponse.ts")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/chart_with_20_metric_and_view_by_attribute_result.ts")(projectId)
        .executionResult,
});

export const metricsInSecondaryAxis = chartWith20MetricsAndViewByAttribute.executionRequest.afm.measures
    .map((measure: any, index: number) => {
        if (index % 2 === 0) {
            return measure.localIdentifier;
        }
        return null;
    })
    .filter((localIdentifier: string) => localIdentifier);

export function barChartWithNTimes3MetricsAndViewByAttribute(n = 1) {
    let dataSet: any = immutableSet(
        barChartWith3MetricsAndViewByAttribute,
        "executionRequest.afm.measures",
        repeatItemsNTimes(barChartWith3MetricsAndViewByAttribute.executionRequest.afm.measures, n),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
}

export const barChartWith18MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(6);

export const barChartWith60MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(18);

export const barChartWith150MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(54);

export const barChartWith6PopMeasuresAndViewByAttribute = (() => {
    const n = 6;
    let dataSet: any = immutableSet(
        barChartWithPopMeasureAndViewByAttribute,
        "executionRequest.afm.measures",
        range(n).reduce((result, measuresIndex) => {
            const { measures } = barChartWithPopMeasureAndViewByAttribute.executionRequest.afm;
            const popMeasure = cloneDeep(measures[0]);
            const postfix = `_${measuresIndex}`;
            popMeasure.localIdentifier += postfix;
            popMeasure.definition.popMeasure.measureIdentifier += postfix;
            popMeasure.definition.popMeasure.popAttribute = {
                uri: popMeasure.definition.popMeasure.popAttribute + postfix,
            };
            popMeasure.alias += postfix;
            const sourceMeasure = cloneDeep(measures[1]);
            sourceMeasure.localIdentifier += postfix;
            sourceMeasure.definition.measure.item.uri += postfix;
            sourceMeasure.alias += postfix;
            return result.concat([popMeasure, sourceMeasure]);
        }, []),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ).map((headerItem: any, headerItemIndex: any) => {
            const postfix = `_${Math.floor(headerItemIndex / 2)}`;
            return {
                measureHeaderItem: {
                    ...headerItem.measureHeaderItem,
                    localIdentifier: headerItem.measureHeaderItem.localIdentifier + postfix,
                },
            };
        }),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
})();

export const barChartWith6PreviousPeriodMeasures = (() => {
    const n = 6;
    let dataSet: any = immutableSet(
        barChartWithPreviousPeriodMeasure,
        "executionRequest.afm.measures",
        range(n).reduce((result, measuresIndex) => {
            const { measures } = barChartWithPreviousPeriodMeasure.executionRequest.afm;
            const previousPeriodMeasure = cloneDeep(measures[0]);
            const postfix = `_${measuresIndex}`;
            previousPeriodMeasure.localIdentifier += postfix;
            previousPeriodMeasure.definition.previousPeriodMeasure.measureIdentifier += postfix;
            previousPeriodMeasure.definition.previousPeriodMeasure.dateDataSets.forEach(
                (dateDataSet: any) => {
                    dateDataSet.dataSet.uri += postfix;
                },
            );
            previousPeriodMeasure.alias += postfix;
            const sourceMeasure = cloneDeep(measures[1]);
            sourceMeasure.localIdentifier += postfix;
            sourceMeasure.definition.measure.item.uri += postfix;
            sourceMeasure.alias += postfix;
            return result.concat([previousPeriodMeasure, sourceMeasure]);
        }, []),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ).map((headerItem: any, headerItemIndex: any) => {
            const postfix = `_${Math.floor(headerItemIndex / 2)}`;
            return {
                measureHeaderItem: {
                    ...headerItem.measureHeaderItem,
                    localIdentifier: headerItem.measureHeaderItem.localIdentifier + postfix,
                },
            };
        }),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
})();

export const customPalette = [
    {
        guid: "01",
        fill: {
            r: 255,
            g: 105,
            b: 180,
        },
    },
    {
        guid: "02",
        fill: {
            r: 212,
            g: 6,
            b: 6,
        },
    },
    {
        guid: "03",
        fill: {
            r: 238,
            g: 156,
            b: 0,
        },
    },
    {
        guid: "04",
        fill: {
            r: 227,
            g: 255,
            b: 0,
        },
    },
    {
        guid: "05",
        fill: {
            r: 6,
            g: 191,
            b: 0,
        },
    },
    {
        guid: "06",
        fill: {
            r: 0,
            g: 26,
            b: 152,
        },
    },
];

export const heatmapMetricRowColumn: any = (projectId: string) => ({
    executionRequest: require("./heat_map_with_metric_row_column_request.ts")(projectId).execution,
    executionResponse: require("./heat_map_with_metric_row_column_response.ts")(projectId).executionResponse,
    executionResult: require("./heat_map_with_metric_row_column_result.ts")(projectId).executionResult,
});

export const heatmapEmptyCells: any = (projectId: string) => ({
    executionRequest: require("./heat_map_with_empty_cells_request.ts")(projectId).execution,
    executionResponse: require("./heat_map_with_empty_cells_response.ts")(projectId).executionResponse,
    executionResult: require("./heat_map_with_empty_cells_result.ts")(projectId).executionResult,
});

export const pivotTableWithTwoMetricsFourAttributesSubtotals = (projectId: string) => ({
    executionRequest: require("./pivot_table_with_2_metrics_4_attributes_subtotals_request.ts")(projectId)
        .execution,
    executionResponse: require("./pivot_table_with_2_metrics_4_attributes_subtotals_response.ts")(projectId)
        .executionResponse,
    executionResult: require("./pivot_table_with_2_metrics_4_attributes_subtotals_result.ts")(projectId)
        .executionResult,
});

export const dualChartWithComputedAttribute: any = (projectId: string) => ({
    executionRequest: require("./dual_chart_with_computed_attribute_request.ts")(projectId).execution,
    executionResponse: require("./dual_chart_with_computed_attribute_response.ts")(projectId)
        .executionResponse,
    executionResult: require("./dual_chart_with_computed_attribute_result.ts")(projectId).executionResult,
});

export default {
    pivotTableWithColumnAndRowAttributes: pivotTableWithColumnAndRowAttributes("mockproject"),
    pivotTableWithColumnRowAttributesAndTotals: pivotTableWithColumnRowAttributesAndTotals("mockproject"),
    pivotTableWithSubtotals: pivotTableWithSubtotals("mockproject"),
    barChartWithSingleMeasureAndNoAttributes: barChartWithSingleMeasureAndNoAttributes("mockproject"),
    barChartWithoutAttributes: barChartWithoutAttributes("mockproject"),
    barChartWith3MetricsAndViewByAttribute: barChartWith3MetricsAndViewByAttribute("mockproject"),
    areaChartWith3MetricsAndViewByAttribute: areaChartWith3MetricsAndViewByAttribute("mockproject"),
    areaChartWithNegativeValues: areaChartWithNegativeValues("mockproject"),
    areaChartWith1MetricsAndStackByAttributeAndFilters: areaChartWith1MetricsAndStackByAttributeAndFilters(
        "mockproject",
    ),
    areaChartWithMeasureViewByAndStackBy: areaChartWithMeasureViewByAndStackBy("mockproject"),
    barChartWith18MetricsAndViewByAttribute: barChartWith18MetricsAndViewByAttribute("mockproject"),
    barChartWith60MetricsAndViewByAttribute: barChartWith60MetricsAndViewByAttribute("mockproject"),
    barChartWithViewByAttribute: barChartWithViewByAttribute("mockproject"),
    barChartWithManyViewByAttributeValues: barChartWithManyViewByAttributeValues("mockproject"),
    barChartWithStackByAndViewByAttributes: barChartWithStackByAndViewByAttributes("mockproject"),
    barChartWithPopMeasureAndViewByAttribute: barChartWithPopMeasureAndViewByAttribute("mockproject"),
    barChartWith6PopMeasuresAndViewByAttribute: barChartWith6PopMeasuresAndViewByAttribute("mockproject"),
    barChartWithPreviousPeriodMeasure: barChartWithPreviousPeriodMeasure("mockproject"),
    barChartWith6PreviousPeriodMeasures: barChartWith6PreviousPeriodMeasures("mockproject"),
    pieChartWithMetricsOnly: pieChartWithMetricsOnly("mockproject"),
    barChartWithNegativeAndZeroValues: barChartWithNegativeAndZeroValues("mockproject"),
    headlineWithOneMeasure: headlineWithOneMeasure("mockproject"),
    headlineWithTwoMeasures: headlineWithTwoMeasures("mockproject"),
    comboWithTwoMeasuresAndViewByAttribute: comboWithTwoMeasuresAndViewByAttribute("mockproject"),
    comboWithTwoMeasuresAndViewByAttributeMdObject: comboWithTwoMeasuresAndViewByAttributeMdObject(
        "mockproject",
    ),
    scatterWithNulls: scatterWithNulls("mockproject"),
    tableWithSorting: tableWithSorting("mockproject"),
    treemapWithMetricAndViewByAttribute: treemapWithMetricAndViewByAttribute("mockproject"),
    treemapWithMetricAndStackByAttribute: treemapWithMetricAndStackByAttribute("mockproject"),
    treemapWithMetricViewByAndStackByAttribute: treemapWithMetricViewByAndStackByAttribute("mockproject"),
    treemapWithTwoMetricsAndStackByAttribute: treemapWithTwoMetricsAndStackByAttribute("mockproject"),
    treemapWithMetricAndViewByAndOnlyOneElement: treemapWithMetricAndViewByAndOnlyOneElement("mockproject"),
    treemapWithThreeMetrics: treemapWithThreeMetrics("mockproject"),
    treemapWithOneMetric: treemapWithOneMetric("mockproject"),
    heatmapMetricRowColumn: heatmapMetricRowColumn("mockproject"),
    pivotTableWithTwoMetricsFourAttributesSubtotals: pivotTableWithTwoMetricsFourAttributesSubtotals(
        "mockproject",
    ),
};
