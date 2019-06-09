import _ from "lodash";

import { BridgeConfiguration, BridgeMetadata, BridgeModels } from "./types";
import { getMetadata, getSchemas } from "./utils/axios";
import { uidRegEx } from "./utils/metadata";
import { defaultConfig } from "./models/configuration";
import { timeout } from "./utils";

export default class Bridge {
    /** Singleton instance definition **/
    private constructor() {}
    private static instance: Bridge;
    static getInstance(): Bridge {
        if (!Bridge.instance) Bridge.instance = new Bridge();
        return Bridge.instance;
    }

    /** Private properties **/
    private loading: boolean = true;
    private config: BridgeConfiguration = defaultConfig;
    private fetchLock: boolean = false;
    private fetchCache: Map<string, BridgeMetadata> = new Map();
    private fetchQueue: string[] = [];
    private fetchBlacklist: Set<string> = new Set();

    /** Public properties **/
    public models: BridgeModels = {};

    /**
     * Initializes the Bridge library
     *
     * @public
     * @param config - Bridge configuration object
     */
    public init = (config: BridgeConfiguration = {}): void => {
        this.config = { ...this.config, ...config };

        getSchemas(config).then(schemas => console.log(schemas));
    };

    /**
     * Get elements from the API
     *
     * @public
     * @param elements - Array of ids to fetch
     */
    public get = async (elements: string[]): Promise<BridgeMetadata[]> => {
        if (this.fetchLock) {
            await timeout(100);
            return this.get(elements);
        }

        await this.fetch(elements);
        return this.getElements(elements);
    };

    /**
     * Fetch metadata that could be used and store it in a local store
     * @description Preheat stalls method calls to the background and sends requests in batch
     *
     * @public
     * @param elements -  Array of ids to preheat
     */
    public preheat = (elements: string[] = []): void => {
        this.fetch(elements, false);
    };

    /**
     * Queries the instance to retrieve metadata for each id
     *
     * @private
     * @param elements - Array of ids to fetch
     * @param preheat - Option to disable preheat
     */
    private fetch = async (elements: string[] = [], preheat: boolean = true): Promise<void> => {
        const ids = [...this.fetchQueue, ...this.cleanIds(elements)];
        if (ids.length === 0 || this.fetchLock) {
            this.fetchQueue = ids;
            if (this.config.debug) console.debug("fetch", "Stalled call", this.fetchQueue);
            return;
        }

        this.fetchLock = true;
        this.fetchQueue = [];

        if (this.config.debug) console.debug("fetch", preheat, elements, ids);
        const data = await getMetadata(this.config, ids);

        // Cache elements
        const validIds = _.map(data, "id");
        _.difference(ids, validIds).forEach((e: string): any => this.fetchBlacklist.add(e));
        if (this.config.cache)
            data.forEach((e: BridgeMetadata): any => this.fetchCache.set(e.id, e));

        // Preheat references
        const references = _(JSON.stringify(data).match(uidRegEx))
            .filter((id: string): boolean => !this.fetchBlacklist.has(id))
            .value();
        if (this.config.preheat && preheat) this.preheat(references);

        this.fetchLock = false;
        if (this.fetchQueue.length > 0) this.fetch([], false);
    };

    private cleanIds = (elements: string[]): string[] =>
        _(elements)
            .uniq()
            .filter((id: string): boolean => !this.fetchBlacklist.has(id))
            .filter((id: string): boolean => !this.fetchCache.has(id))
            .value();

    private getElements = (elements: string[]): BridgeMetadata[] =>
        _(elements)
            .map((id: string): BridgeMetadata => this.fetchCache.get(id))
            .value();
}
