export interface BridgeConfiguration {
    baseUrl?: string;
    credentials?: {
        username: string;
        password: string;
    };
    listFields?: string[];
    cache?: boolean;
    preheat?: boolean;
    debug?: boolean;
}

export interface BridgeModels {
    [metadataType: string]: BridgeModel;
}

export interface BridgeModel {
    apiEndpoint: string;
    displayName: string;
    isIdentifiable: boolean;
    isMetadata: boolean;
    isShareable: boolean;
    isPersisted: string;
    properties: any;
    references: any;
    name: string;
    collectionName: string;
    relativeApiEndpoint: string;
}

export type BridgeMetadata = any;
