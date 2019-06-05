import _ from "lodash";

import { BridgeConfiguration, BridgeMetadata, BridgeModels } from "./types";

export default class Bridge {
    /** Singleton instance definition **/
    private constructor() {}
    private static instance: Bridge;
    static getInstance(): Bridge {
        if (!Bridge.instance) Bridge.instance = new Bridge();
        return Bridge.instance;
    }

    /** Private properties **/
    private config: BridgeConfiguration = {};
    private preheatStore: Map<string, BridgeMetadata> = new Map();
    private preheatQueue: string[] = [];

    /** Public properties **/
    public models: BridgeModels = {};

    /**
     * Queries the instance to retrieve metadata for each id
     *
     * @private
     * @param ids - Array of ids to fetch
     * @returns Array of metadata found
     */
    private fetch = async (...ids: string[]): Promise<BridgeMetadata[]> => {
        return [];
    };

    /**
     * Initializes the Bridge library
     *
     * @public
     * @param config - Bridge configuration object
     */
    public init = (config: BridgeConfiguration = {}): void => {
        this.config = _.merge(this.config, config);
    };

    /**
     * Fetch metadata that could be used and store it in a local store
     * @description Preheat stalls method calls to the background and sends requests in batch
     *
     * @public
     * @param ids -  Array of ids to preheat
     */
    public preheat = (...ids: string[]): void => {
        // noop
    };
}
