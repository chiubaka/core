import { Attribute, ForeignKey, ManyToMany, Model as OrmModel, ModelFields, OneToOne } from "redux-orm";
export interface IBackendModel {
    [propertyName: string]: any;
    id: string;
}
export interface IModel extends IBackendModel {
    lastSynced?: number;
    lastUpdate?: number;
    syncing?: boolean;
}
export declare abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}> extends OrmModel<TFields, TAdditional, TVirtualFields> {
    static searchable: boolean;
    static localFields: {
        lastSynced: Attribute;
        lastUpdate: Attribute;
        syncing: Attribute;
    };
    static readonly localFieldKeys: Set<string>;
    static excludedFieldKeys: string[];
    static backendFieldKeys: string[];
    static fields: ModelFields;
    static isLocalField: (fieldName: string) => boolean;
    static readonly relationalFields: {
        [fieldName: string]: ForeignKey | ManyToMany | OneToOne;
    };
    static readonly allFields: {
        [x: string]: any;
    };
    static create<TFields = any>(props: TFields): any;
    static getRelationshipMap(): {
        [fieldName: string]: string;
    };
    static getBackRelationFieldName(fieldName: string, relatedModel: typeof Model): any;
    private static _localFieldKeys;
    private static _relationalFields;
    private static _relationshipMap;
    private static scrubProperties;
    private static isManyRelationship;
    private static isVirtualField;
    private static upsertRelatedInstances;
    private static upsertManyRelatedInstances;
    private static addManyBackRelation;
    private static isRelationalField;
    private static linkRelatedInstances;
    update(props: any): void;
    forBackend(): IBackendModel;
    private scrubLocalFields;
    private scrubExcludedFields;
    private normalizeRelationships;
}
