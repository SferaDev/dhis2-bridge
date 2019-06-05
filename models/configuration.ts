import { BridgeConfiguration } from "../types";

export const defaultConfig: BridgeConfiguration = {
    baseUrl: "https://play.dhis2.org/demo",
    credentials: {
        username: "admin",
        password: "district",
    },
    listFields: ["id", "name"],
    preheat: true,
};
