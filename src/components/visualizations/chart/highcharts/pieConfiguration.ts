// (C) 2007-2018 GoodData Corporation
import cloneDeep = require('lodash/cloneDeep');

const PIE_TEMPLATE = {
    chart: {
        type: 'pie',
        events: {
            load() {
                this.series[0].update({
                    dataLabels: {
                        distance: -(this.series[0].points[0].shapeArgs.r / 3)
                    }
                });
            }
        }

    },
    plotOptions: {
        pie: {
            size: '100%',
            allowPointSelect: false,
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    legend: {
        enabled: false
    }
};

export function getPieConfiguration() {
    return cloneDeep(PIE_TEMPLATE);
}
