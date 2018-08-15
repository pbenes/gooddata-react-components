// (C) 2007-2018 GoodData Corporation
import {
    getDataPoints,
    getVisibleSeries,
    hideDataLabel,
    intersectsParentLabel,
    isLabelOverlappingItsShape,
    showDataLabel
} from '../../helpers';

const autohideLabelsOverlappingItsShape = (chart: any) => {
    const visibleSeries = getVisibleSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);

    visiblePoints.forEach((point: any) => {
        if (isLabelOverlappingItsShape(point) || intersectsParentLabel(point, visiblePoints)) {
            hideDataLabel(point);
        } else {
            showDataLabel(point);
        }
    });
};

export default autohideLabelsOverlappingItsShape;
