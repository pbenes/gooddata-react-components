// (C) 2007-2020 GoodData Corporation
import { range, cloneDeep } from "lodash";

import { immutableSet, repeatItemsNTimes } from "../../src/components/visualizations/utils/common";
import { STACK_BY_DIMENSION_INDEX } from "../../src/components/visualizations/chart/constants";

export const barChartWithSingleMeasureAndNoAttributes = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_single_measure_and_no_attributes_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_single_measure_and_no_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_single_measure_and_no_attributes_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWithoutAttributes = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_without_attributes_request.js")(projectId).execution,
    executionResponse: require("../test_data/bar_chart_without_attributes_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_without_attributes_result.js")(projectId)
        .executionResult,
});

export const barChartWithNegativeAndZeroValues = (projectId: string) =>
    immutableSet(barChartWithoutAttributes(projectId), "executionResult.data", [["-116625456.54"], ["0"]]);

export const barChartWith3MetricsAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWith2MetricsAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWith4MetricsAndViewBy2Attribute = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWith4MetricsAndViewBy2AttributeAndSomeNullDataPoint = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_with_some_null_datapoints_result.js")(
        projectId,
    ).executionResult,
});

export const chartWithTwoAttributesAndSomeNullDatapoints = (projectId: string) => ({
    executionRequest: require("../test_data/chart_with_2_attributes_and_null_datapoints_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/chart_with_2_attributes_and_null_datapoints_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/chart_with_2_attributes_and_null_datapoints_result.js")(projectId)
        .executionResult,
});

export const scatterPlotWith2MetricsAndAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/scatter_plot_with_2_metrics_and_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/scatter_plot_with_2_metrics_and_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/scatter_plot_with_2_metrics_and_attribute_result.js")(projectId)
        .executionResult,
    mdObject: require("../test_data/scatter_plot_with_2_metrics_and_attribute_md.js")(projectId),
});

export const scatterWithNulls = (projectId: string) => ({
    ...scatterPlotWith2MetricsAndAttribute(projectId),
    executionResult: require("../test_data/scatter_plot_with_nulls_result.js")(projectId).executionResult,
});

export const bubbleChartWith3MetricsAndAttributeMd = (projectId: string) => ({
    mdObject: require("../test_data/bubble_chart_with_3_metrics_and_attribute_md.js")(projectId),
});

export const bubbleChartWith3MetricsAndAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_and_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_and_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_and_attribute_result.js")(projectId)
        .executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd(projectId),
});

export const bubbleChartWith3MetricsMd = (projectId: string) => ({
    mdObject: require("../test_data/bubble_chart_with_3_metrics_md.js")(projectId),
});

export const bubbleChartWith3AMMetricsAndAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_result.js")(projectId)
        .executionResult,
    mdObject: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_md.js")(projectId),
});

export const bubbleChartWith3Metrics = (projectId: string) => ({
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_request.js")(projectId).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_result.js")(projectId).executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd(projectId),
});

export const bubbleChartWithNulls = (projectId: string) => ({
    ...bubbleChartWith3MetricsAndAttribute(projectId),
    ...bubbleChartWith3MetricsAndAttributeMd(projectId),
    executionResult: require("../test_data/bubble_chart_with_nulls_result.js")(projectId).executionResult,
});

export const areaChartWith3MetricsAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_result.js")(
        projectId,
    ).executionResult,
});

export const areaChartWith1MetricsAndStackByAttributeAndFilters = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_result.js")(
        projectId,
    ).executionResult,
});

export const areaChartWithNegativeValues = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_negative_values_request.js")(projectId).execution,
    executionResponse: require("../test_data/area_chart_with_negative_values_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/area_chart_with_negative_values_result.js")(projectId)
        .executionResult,
});

export const areaChartWithMeasureViewByAndStackBy = (projectId: string) => ({
    executionRequest: require("../test_data/area_chart_with_measure_view_by_and_stack_by_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/area_chart_with_measure_view_by_and_stack_by_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_measure_view_by_and_stack_by_result.js")(projectId)
        .executionResult,
});

export const barChartWithViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_view_by_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_view_by_attribute_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_with_view_by_attribute_result.js")(projectId)
        .executionResult,
});

export const barChartWithManyViewByAttributeValues = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_many_view_by_attribute_values_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_many_view_by_attribute_values_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_many_view_by_attribute_values_result.js")(projectId)
        .executionResult,
});

export const barChartWithStackByAndViewByAttributes = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWithStackByAndOnlyOneStack = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_result.js")(projectId)
        .executionResult,
});

export const barChartWithPopMeasureAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_result.js")(
        projectId,
    ).executionResult,
});

export const barChartWithPreviousPeriodMeasure = (projectId: string) => ({
    executionRequest: require("../test_data/bar_chart_with_previous_period_measure_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/bar_chart_with_previous_period_measure_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/bar_chart_with_previous_period_measure_result.js")(projectId)
        .executionResult,
});

export const columnChartWithMeasureViewByAndComputeRatio = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_result.js")(
        projectId,
    ).executionResult,
});

export const columnChartWithMeasureViewBy = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_result.js")(projectId)
        .executionResult,
});

export const columnChartWithMeasureViewBy2AttributesAndComputeRatio = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_result.js")(
        projectId,
    ).executionResult,
});

export const columnChartWithMeasureViewBy2Attributes = (projectId: string) => ({
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_result.js")(
        projectId,
    ).executionResult,
});

export const pieChartWithMetricsOnly = (projectId: string) => ({
    executionRequest: require("../test_data/pie_chart_with_metrics_only_request.js")(projectId).execution,
    executionResponse: require("../test_data/pie_chart_with_metrics_only_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/pie_chart_with_metrics_only_result.js")(projectId).executionResult,
});

export const headlineWithOneMeasure = (projectId: string) => ({
    executionRequest: require("../test_data/headline_with_one_measure_request.js")(projectId).execution,
    executionResponse: require("../test_data/headline_with_one_measure_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/headline_with_one_measure_result.js")(projectId).executionResult,
});

export const headlineWithTwoMeasures = (projectId: string) => ({
    executionRequest: require("../test_data/headline_with_two_measures_request.js")(projectId).execution,
    executionResponse: require("../test_data/headline_with_two_measures_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/headline_with_two_measures_result.js")(projectId).executionResult,
});

export const pivotTableWithColumnAndRowAttributes = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_column_and_row_attributes_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/pivot_table_with_column_and_row_attributes_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_and_row_attributes_result.js")(projectId)
        .executionResult,
});

export const pivotTableWithColumnRowAttributesAndTotals = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_column_row_attributes_and_totals_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/pivot_table_with_column_row_attributes_and_totals_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_row_attributes_and_totals_result.js")(
        projectId,
    ).executionResult,
});

export const pivotTableWithSubtotals = (projectId: string) => ({
    executionRequest: require("../test_data/pivot_table_with_subtotals_request.js")(projectId).execution,
    executionResponse: require("../test_data/pivot_table_with_subtotals_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/pivot_table_with_subtotals_result.js")(projectId).executionResult,
});

export const comboWithTwoMeasuresAndViewByAttribute = barChartWith2MetricsAndViewByAttribute;
export const comboWithTwoMeasuresAndViewByAttributeMdObject = (projectId: string) => ({
    buckets: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")(projectId)
        .buckets,
    filters: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")(projectId)
        .buckets,
    visualizationClass: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")(
        projectId,
    ).buckets,
});

export const comboWithThreeMeasuresAndViewByAttribute = barChartWith3MetricsAndViewByAttribute;
export const comboWithThreeMeasuresAndViewByAttributeMdObject = (projectId: string) => ({
    buckets: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.js")(projectId)
        .buckets,
    visualizationClass: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.js")(
        projectId,
    ).visualizationClass,
});

export const tableWithSorting = (projectId: string) => ({
    executionRequest: require("../test_data/table_with_sort_request.js")(projectId).execution,
    executionResponse: require("../test_data/table_with_sort_response.js")(projectId).executionResponse,
    executionResult: require("../test_data/table_with_sort_result.js")(projectId).executionResult,
});

export const treemapWithMetricAndViewByAttributeMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_and_view_by_attribute_md.js")(projectId),
});

export const treemapWithMetricAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_attribute_result.js")(projectId)
        .executionResult,
    ...treemapWithMetricAndViewByAttributeMd(projectId),
});

export const treemapWithMetricAndViewByAndOnlyOneElement = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_and_only_one_element_result.js")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricAndViewByAttributeMd(projectId),
});

export const treemapWithMetricAndStackByAttributeMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_and_stack_by_attribute_md.js")(projectId),
});

export const treemapWithMetricAndStackByAttribute = (projectId: string) => ({
    ...treemapWithMetricAndViewByAttribute(projectId), // execution is the same
    ...treemapWithMetricAndStackByAttributeMd(projectId),
});

export const treemapWithMetricViewByAndStackByAttributeMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_md.js")(projectId),
});

export const treemapWithMetricViewByAndStackByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_result.js")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricViewByAndStackByAttributeMd(projectId),
});

export const treemapWithTwoMetricsAndStackByAttributeMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_md.js")(projectId),
});

export const treemapWithTwoMetricsAndStackByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_request.js")(
        projectId,
    ).execution,
    executionResponse: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_response.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_result.js")(
        projectId,
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithTwoMetricsAndStackByAttributeMd(projectId),
});

export const treemapWithThreeMetricsMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_three_metrics_md.js")(projectId),
});

export const treemapWithThreeMetrics = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_three_metrics_request.js")(projectId).execution,
    executionResponse: require("../test_data/treemap_with_three_metrics_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/treemap_with_three_metrics_result.js")(projectId).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithThreeMetricsMd(projectId),
});

export const treemapWithOneMetricMd = (projectId: string) => ({
    mdObject: require("../test_data/treemap_with_one_metric_md.js")(projectId),
});

export const treemapWithOneMetric = (projectId: string) => ({
    executionRequest: require("../test_data/treemap_with_one_metric_request.js")(projectId).execution,
    executionResponse: require("../test_data/treemap_with_one_metric_response.js")(projectId)
        .executionResponse,
    executionResult: require("../test_data/treemap_with_one_metric_result.js")(projectId).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithOneMetricMd(projectId),
});

export const chartWith20MetricsAndViewByAttribute = (projectId: string) => ({
    executionRequest: require("../test_data/chart_with_20_metric_and_view_by_attribute_request.js")(projectId)
        .execution,
    executionResponse: require("../test_data/chart_with_20_metric_and_view_by_attribute_reponse.js")(
        projectId,
    ).executionResponse,
    executionResult: require("../test_data/chart_with_20_metric_and_view_by_attribute_result.js")(projectId)
        .executionResult,
});

export const metricsInSecondaryAxis = (projectId: string) =>
    chartWith20MetricsAndViewByAttribute(projectId)
        .executionRequest.afm.measures.map((measure: any, index: number) => {
            if (index % 2 === 0) {
                return measure.localIdentifier;
            }
            return null;
        })
        .filter((localIdentifier: string) => localIdentifier);

export function barChartWithNTimes3MetricsAndViewByAttribute(projectId: string, n = 1) {
    let dataSet = immutableSet(
        barChartWith3MetricsAndViewByAttribute(projectId),
        "executionRequest.afm.measures",
        repeatItemsNTimes(barChartWith3MetricsAndViewByAttribute(projectId).executionRequest.afm.measures, n),
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

export const barChartWith18MetricsAndViewByAttribute = (projectId: string) =>
    barChartWithNTimes3MetricsAndViewByAttribute(projectId, 6);

export const barChartWith60MetricsAndViewByAttribute = (projectId: string) =>
    barChartWithNTimes3MetricsAndViewByAttribute(projectId, 18);

export const barChartWith150MetricsAndViewByAttribute = (projectId: string) =>
    barChartWithNTimes3MetricsAndViewByAttribute(projectId, 54);

export const barChartWith6PopMeasuresAndViewByAttribute = (projectId: string) =>
    (() => {
        const n = 6;
        let dataSet = immutableSet(
            barChartWithPopMeasureAndViewByAttribute(projectId),
            "executionRequest.afm.measures",
            range(n).reduce((result, measuresIndex) => {
                const { measures } = barChartWithPopMeasureAndViewByAttribute(projectId).executionRequest.afm;
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

export const barChartWith6PreviousPeriodMeasures = (projectId: string) =>
    (() => {
        const n = 6;
        let dataSet = immutableSet(
            barChartWithPreviousPeriodMeasure(projectId),
            "executionRequest.afm.measures",
            range(n).reduce((result, measuresIndex) => {
                const { measures } = barChartWithPreviousPeriodMeasure(projectId).executionRequest.afm;
                const previousPeriodMeasure = cloneDeep(measures[0]);
                const postfix = `_${measuresIndex}`;
                previousPeriodMeasure.localIdentifier += postfix;
                previousPeriodMeasure.definition.previousPeriodMeasure.measureIdentifier += postfix;
                previousPeriodMeasure.definition.previousPeriodMeasure.dateDataSets.forEach((dateDataSet: any) => {
                    dateDataSet.dataSet.uri += postfix;
                });
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
            ).map((headerItem: any, headerItemIndex: number) => {
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

export const heatmapMetricRowColumn = (projectId: string) => ({
    executionRequest: require("./heat_map_with_metric_row_column_request.js")(projectId).execution,
    executionResponse: require("./heat_map_with_metric_row_column_response.js")(projectId).executionResponse,
    executionResult: require("./heat_map_with_metric_row_column_result.js")(projectId).executionResult,
});

export const heatmapEmptyCells = (projectId: string) => ({
    executionRequest: require("./heat_map_with_empty_cells_request.js")(projectId).execution,
    executionResponse: require("./heat_map_with_empty_cells_response.js")(projectId).executionResponse,
    executionResult: require("./heat_map_with_empty_cells_result.js")(projectId).executionResult,
});

export const pivotTableWithTwoMetricsFourAttributesSubtotals = (projectId: string) => ({
    executionRequest: require("./pivot_table_with_2_metrics_4_attributes_subtotals_request.js")(projectId)
        .execution,
    executionResponse: require("./pivot_table_with_2_metrics_4_attributes_subtotals_response.js")(projectId)
        .executionResponse,
    executionResult: require("./pivot_table_with_2_metrics_4_attributes_subtotals_result.js")(projectId)
        .executionResult,
});

export const dualChartWithComputedAttribute = (projectId: string) => ({
    executionRequest: require("./dual_chart_with_computed_attribute_request.js")(projectId).execution,
    executionResponse: require("./dual_chart_with_computed_attribute_response.js")(projectId)
        .executionResponse,
    executionResult: require("./dual_chart_with_computed_attribute_result.js")(projectId).executionResult,
});

export default {
    pivotTableWithColumnAndRowAttributes: pivotTableWithColumnAndRowAttributes("storybook"),
    pivotTableWithColumnRowAttributesAndTotals: pivotTableWithColumnRowAttributesAndTotals("storybook"),
    pivotTableWithSubtotals: pivotTableWithSubtotals("storybook"),
    barChartWithSingleMeasureAndNoAttributes: barChartWithSingleMeasureAndNoAttributes("storybook"),
    barChartWithoutAttributes: barChartWithoutAttributes("storybook"),
    barChartWith3MetricsAndViewByAttribute: barChartWith3MetricsAndViewByAttribute("storybook"),
    areaChartWith3MetricsAndViewByAttribute: areaChartWith3MetricsAndViewByAttribute("storybook"),
    areaChartWithNegativeValues: areaChartWithNegativeValues("storybook"),
    areaChartWith1MetricsAndStackByAttributeAndFilters: areaChartWith1MetricsAndStackByAttributeAndFilters(
        "storybook",
    ),
    areaChartWithMeasureViewByAndStackBy: areaChartWithMeasureViewByAndStackBy("storybook"),
    barChartWith18MetricsAndViewByAttribute: barChartWith18MetricsAndViewByAttribute("storybook"),
    barChartWith60MetricsAndViewByAttribute: barChartWith60MetricsAndViewByAttribute("storybook"),
    barChartWithViewByAttribute: barChartWithViewByAttribute("storybook"),
    barChartWithManyViewByAttributeValues: barChartWithManyViewByAttributeValues("storybook"),
    barChartWithStackByAndViewByAttributes: barChartWithStackByAndViewByAttributes("storybook"),
    barChartWithPopMeasureAndViewByAttribute: barChartWithPopMeasureAndViewByAttribute("storybook"),
    barChartWith6PopMeasuresAndViewByAttribute: barChartWith6PopMeasuresAndViewByAttribute("storybook"),
    barChartWithPreviousPeriodMeasure: barChartWithPreviousPeriodMeasure("storybook"),
    barChartWith6PreviousPeriodMeasures: barChartWith6PreviousPeriodMeasures("storybook"),
    pieChartWithMetricsOnly: pieChartWithMetricsOnly("storybook"),
    barChartWithNegativeAndZeroValues: barChartWithNegativeAndZeroValues("storybook"),
    headlineWithOneMeasure: headlineWithOneMeasure("storybook"),
    headlineWithTwoMeasures: headlineWithTwoMeasures("storybook"),
    comboWithTwoMeasuresAndViewByAttribute: comboWithTwoMeasuresAndViewByAttribute("storybook"),
    comboWithTwoMeasuresAndViewByAttributeMdObject: comboWithTwoMeasuresAndViewByAttributeMdObject(
        "storybook",
    ),
    scatterWithNulls: scatterWithNulls("storybook"),
    tableWithSorting: tableWithSorting("storybook"),
    treemapWithMetricAndViewByAttribute: treemapWithMetricAndViewByAttribute("storybook"),
    treemapWithMetricAndStackByAttribute: treemapWithMetricAndStackByAttribute("storybook"),
    treemapWithMetricViewByAndStackByAttribute: treemapWithMetricViewByAndStackByAttribute("storybook"),
    treemapWithTwoMetricsAndStackByAttribute: treemapWithTwoMetricsAndStackByAttribute("storybook"),
    treemapWithMetricAndViewByAndOnlyOneElement: treemapWithMetricAndViewByAndOnlyOneElement("storybook"),
    treemapWithThreeMetrics: treemapWithThreeMetrics("storybook"),
    treemapWithOneMetric: treemapWithOneMetric("storybook"),
    heatmapMetricRowColumn: heatmapMetricRowColumn("storybook"),
    pivotTableWithTwoMetricsFourAttributesSubtotals: pivotTableWithTwoMetricsFourAttributesSubtotals(
        "storybook",
    ),
};
