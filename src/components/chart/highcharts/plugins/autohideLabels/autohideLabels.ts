// (C) 2007-2018 GoodData Corporation
import { getChartType } from '../../helpers';
import { COLUMN_CHART, BAR_CHART } from '../../../../VisualizationTypes';
import autohideColumnLabels from './autohideColumnLabels';
import autohideBarLabels from './autohideBarLabels';

const autohideLabels = (Highcharts: any) => {
    Highcharts.wrap(Highcharts.Chart.prototype, 'hideOverlappingLabels', function(proceed: any, labels: any) {
        const chart = this;
        const chartType = getChartType(this);

        if (chartType === COLUMN_CHART) {
            autohideColumnLabels(chart);
            return;
        }
        if (chartType === BAR_CHART) {
            autohideBarLabels(chart);
            return;
        }
        proceed.call(this, labels);
    });
};

export default autohideLabels;
