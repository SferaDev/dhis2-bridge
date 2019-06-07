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
    [metadataType: string]: {
        apiEndpoint: string;
        attributeProperties: any;
        displayName: string;
        identifiableObject: boolean;
        isMetaData: boolean;
        isShareable: boolean;
        javaClass: string;
        modelProperties: any;
        modelValidations: any;
        name: string;
        plural: string;
        translatable: boolean;
    };
}

export type BridgeMetadata = any;
