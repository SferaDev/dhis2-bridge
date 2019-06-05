export interface BridgeConfiguration {
    baseUrl?: string;
    credentials?: {
        username: string;
        password: string;
    };
    listFields?: string[];
    preheat?: boolean;
}

export interface BridgeModels {
    [metadataType: string]: any;
}

export type BridgeMetadata = any;
