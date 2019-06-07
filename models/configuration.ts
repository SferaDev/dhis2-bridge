import { BridgeConfiguration } from "../types";

export const defaultConfig: BridgeConfiguration = {
    listFields: ["id", "name"],
    cache: true,
    preheat: false,
    debug: false,
};
