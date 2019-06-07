import _ from "lodash";
import "./lodash-mixins";
import axios, { AxiosRequestConfig } from "axios";

import { BridgeConfiguration } from "../types";

export const authConfig = (config: BridgeConfiguration): AxiosRequestConfig =>
    _.pickBy(
        {
            withCredentials: config.credentials ? null : true,
            auth: config.credentials,
        },
        _.identity
    );

export const getMetadata = async (
    config: BridgeConfiguration,
    elements: string[]
): Promise<any> => {
    const promises = _(elements)
        .chunk(200)
        .map(ids =>
            axios.get(config.baseUrl + "/metadata.json", {
                ...authConfig(config),
                params: {
                    fields: ":all,!organisationUnits,dashboardItems[:all,chart[:all]]",
                    filter: `id:in:[${ids.toString()}]`,
                    defaults: "EXCLUDE",
                    skipSharing: true,
                },
            })
        )
        .value();

    const result = await Promise.all(promises);
    const merged = _.deepMerge({}, ...result.map(result => result.data));
    if (merged.system) delete merged.system;
    if (merged.date) delete merged.date;

    return _(merged)
        .mapValues((obj, key) => obj.map((el: any) => ({ ...el, metadataType: key })))
        .values()
        .flatten()
        .value();
};
