import {
    getChartOptions,
    IChartOptions
} from '../chartOptionsBuilder';

import * as fixtures from '../../../../../stories/test_data/fixtures';
import { IDrillableItem } from '../../../..';

export function generateChartOptions(
    dataSet: any = fixtures.barChartWithStackByAndViewByAttributes,
    config: any = {
        type: 'column',
        stacking: false
    },
    drillableItems: IDrillableItem[] = []
): IChartOptions {
    const {
        executionRequest: { afm, resultSpec },
        executionResponse: { dimensions },
        executionResult: { data, headerItems }
    } = dataSet;
    return getChartOptions(
        afm,
        resultSpec,
        dimensions,
        data,
        headerItems,
        config,
        drillableItems
    );
}
