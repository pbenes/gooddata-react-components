// (C) 2007-2019 GoodData Corporation
import get = require("lodash/get");
import { BucketNames } from "../../index";
import { VisualizationObject } from "@gooddata/typings";
import { getMeasuresFromMdObject } from "./bucketHelper";

function isAttribute(item: VisualizationObject.BucketItem): boolean {
    const attribute = item as VisualizationObject.IVisualizationAttribute;
    return attribute.visualizationAttribute !== undefined;
}

export function hasAttribute(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject.buckets.some(bucket => {
        return bucket.items.some(isAttribute);
    });
}

export function hasTertiaryMeasures(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject.buckets
        .filter(bucket => [BucketNames.TERTIARY_MEASURES].indexOf(get(bucket, "localIdentifier")) >= 0)
        .some(bucket => get<any>(bucket, "items").length > 0);
}

export function isStacked(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return (
        mdObject &&
        mdObject.buckets
            .filter(
                bucket =>
                    [BucketNames.STACK, BucketNames.SEGMENT].indexOf(get(bucket, "localIdentifier")) >= 0,
            )
            .some(bucket => get<any>(bucket, "items").length > 0)
    );
}

export function hasMeasures(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject && getMeasuresFromMdObject(mdObject).length > 0;
}
