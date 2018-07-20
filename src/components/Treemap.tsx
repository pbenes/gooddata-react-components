// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { Treemap as AfmTreemap } from './afm/Treemap';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getTreemapDimensionsFromBuckets } from '../helpers/dimensions';
import { getResultSpec } from '../helpers/resultSpec';
import { MEASURES, VIEW, SEGMENT } from '../constants/bucketNames';

export interface ITreemapBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    segmentBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[]; // TODO would it be removed? if not dont forget to test
}

export interface ITreemapProps extends ICommonChartProps, ITreemapBucketProps {
    projectId: string;
}

type ITreemapNonBucketProps = Subtract<ITreemapProps, ITreemapBucketProps>;

/**
 * [Treemap](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/treemap_component.html)
 * is a component with bucket props measures, viewBy, filters
 */
export function Treemap(props: ITreemapProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || []
        },
        {
            localIdentifier: VIEW,
            items: props.viewBy ? [props.viewBy] : []
        },
        {
            localIdentifier: SEGMENT,
            items: props.segmentBy ? [props.segmentBy] : []
        }
    ];

    const newProps = omit<ITreemapProps, ITreemapNonBucketProps>(
        props, ['measures', 'viewBy', 'segmentBy', 'filters']
    );

    return (
        <AfmTreemap
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy, getTreemapDimensionsFromBuckets)}
        />
    );
}
