import { attr, Model as OrmModel } from "redux-orm";

export interface IBackendModel {
  [propertyName: string]: any;
  id: string;
}

export interface IModel extends IBackendModel {
  lastSynced?: number;
  syncing?: boolean;
}

export abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}>
  extends OrmModel<TFields, TAdditional, TVirtualFields> {
  public static LOCAL_FIELDS = {
    lastSynced: attr(),
    syncing: attr(),
  };

  public static LOCAL_FIELD_KEYS = new Set(Object.keys(Model.LOCAL_FIELDS));

  public static fields = {
    id: attr(),
    ...Model.LOCAL_FIELDS,
  };

  public static isLocalField = (fieldName: string) => {
    return Model.LOCAL_FIELD_KEYS.has(fieldName);
  }

  public forBackend = (): IBackendModel => {
    const ref = {...this.ref};
    Model.LOCAL_FIELD_KEYS.forEach((fieldName) => {
      delete ref[fieldName];
    });
    return ref;
  }
}
