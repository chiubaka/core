import { Model as OrmModel } from "redux-orm";
export interface IBackendModel {
    [propertyName: string]: any;
    id: string;
}
export interface IModel extends IBackendModel {
    lastSynced?: number;
    syncing?: boolean;
}
export declare abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}> extends OrmModel<TFields, TAdditional, TVirtualFields> {
    static LOCAL_FIELDS: {
        lastSynced: import("redux-orm").Attribute;
        syncing: import("redux-orm").Attribute;
    };
    static LOCAL_FIELD_KEYS: Set<string>;
    static fields: {
        lastSynced: import("redux-orm").Attribute;
        syncing: import("redux-orm").Attribute;
        id: import("redux-orm").Attribute;
    };
    static isLocalField: (fieldName: string) => boolean;
    forBackend: () => IBackendModel;
}
