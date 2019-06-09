import _ from "lodash";
import "./lodash-mixins";
import axios, { AxiosRequestConfig } from "axios";

import { BridgeConfiguration, BridgeModel, BridgeModels } from "../types";

export const authConfig = (config: BridgeConfiguration): AxiosRequestConfig =>
    _.pickBy(
        {
            withCredentials: config.credentials ? null : true,
            auth: config.credentials,
        },
        _.identity
    );

export const getSchemas = async (config: BridgeConfiguration): Promise<BridgeModels> => {
    const { data } = await axios.get(config.baseUrl + "/schemas.json", {
        ...authConfig(config),
        params: {
            fields:
                "metadata,displayName,persisted,klass,relativeApiEndpoint,href," +
                "identifiableObject,name,collectionName,references,properties" +
                "[fieldName,required,writable,propertyType,constants,unique" +
                "attribute,ordered,collection,name,persisted,required]",
        },
    });

    return _(
        data.schemas.map(
            (schema: any): BridgeModel => ({
                ...schema,
                references: schema.references.map(
                    (prop: string): string =>
                        data.schemas.find((s: any): boolean => s.klass === prop)
                            ? data.schemas.find((s: any): boolean => s.klass === prop).name
                            : undefined
                ),
            })
        )
    )
        .keyBy("name")
        .mapValues()
        .value();
};

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
