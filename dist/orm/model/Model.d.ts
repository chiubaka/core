import { Attribute, ForeignKey, ManyToMany, Model as OrmModel, ModelFields, OneToOne, ORMId } from "redux-orm";
export interface IBackendModel {
    [propertyName: string]: any;
    id: string;
}
export interface IModel extends IBackendModel {
    lastSynced?: number;
    lastUpdated?: number;
    syncing?: boolean;
}
export declare abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}> extends OrmModel<TFields, TAdditional, TVirtualFields> {
    static searchable: boolean;
    static localFields: {
        lastSynced: Attribute;
        lastUpdated: Attribute;
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
    static generateId<TFields = any>(_props: TFields): string;
    static create<TFields = any>(props: TFields): any;
    static getRelationshipMap(): {
        [fieldName: string]: string;
    };
    static getBackRelationFieldName(fieldName: string, relatedModel: typeof Model): any;
    static forBackend<TFields extends IModel, TAdditional = {}>(ref: TFields & TAdditional & ORMId): IBackendModel;
    private static _localFieldKeys;
    private static _relationalFields;
    private static _relationshipMap;
    private static scrubProperties;
    private static scrubLocalFields;
    private static scrubExcludedFields;
    private static normalizeRelationships;
    private static isManyRelationship;
    private static isVirtualField;
    private static modelForName;
    private static touchRelatedInstance;
    private static upsertRelatedInstances;
    private static upsertManyRelatedInstances;
    private static addManyBackRelation;
    private static isRelationalField;
    private static linkRelatedInstances;
    update(props: any): void;
    delete(): void;
    private touchRelatedInstances;
}
