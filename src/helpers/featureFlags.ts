// (C) 2007-2020 GoodData Corporation
import { IFeatureFlags, SDK } from "@gooddata/gooddata-js";
import { getCachedOrLoad } from "./sdkCache";
// import { IChartConfig } from "../interfaces/Config";
import { isTable } from "../components/visualizations/utils/common";

export async function getFeatureFlags(sdk: SDK, projectId: string): Promise<IFeatureFlags> {
    const apiCallIdentifier = `getFeatureFlags.${projectId}`;
    const loader = () => sdk.project.getFeatureFlags(projectId);
    try {
        return getCachedOrLoad(apiCallIdentifier, loader);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`unable to retrieve featureFlags for project ${projectId}`, error);
        throw Error(error);
    }
}

export function setConfigFromFeatureFlags(
    config: any,
    featureFlags: IFeatureFlags,
): any /* TODO: IChartConfig, but used for table via common props */ {
    if (!featureFlags) {
        return config;
    }

    let result = config;

    if (featureFlags.disableKpiDashboardHeadlineUnderline === true) {
        result = { ...result, disableDrillUnderline: true };
    }

    // TODO: decide if === true like above?
    if (config && isTable(config.type) && featureFlags.enableTableColumnsAutoResizing) {
        result = { ...result, columnSizing: { defaultWidth: "viewport" } };
    }

    return result;
}
