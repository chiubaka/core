export interface IModel {
    [propertyName: string]: any;
    id: string;
    lastSynced?: number;
    syncing?: boolean;
}
export declare const MODEL_FIELDS: {
    id: import("redux-orm").Attribute;
    lastSynced: import("redux-orm").Attribute;
    syncing: import("redux-orm").Attribute;
};
