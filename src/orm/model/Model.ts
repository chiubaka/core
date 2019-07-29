import { attr, Model as OrmModel } from "redux-orm";

export interface IModelWithoutLocalState {
  [propertyName: string]: any;
  id: string;
}

export interface IModel extends IModelWithoutLocalState {
  lastSynced?: number;
  syncing?: boolean;
}

export abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}>
  extends OrmModel<TFields, TAdditional, TVirtualFields> {
  public static fields = {
    id: attr(),
    lastSynced: attr(),
    syncing: attr(),
  };

  public withoutLocalState = (): IModelWithoutLocalState => {
    const ref = {...this.ref};
    delete ref.lastSynced;
    delete ref.syncing;
    return ref;
  }
}
