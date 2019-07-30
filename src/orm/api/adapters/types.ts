import { IBackendModel, NewModel, PartialModel } from "../../model";

export interface IModelApiAdapter {
  create: (payload: NewModel) => Promise<IBackendModel>;
  list: () => Promise<IBackendModel[]>;
  get: (id: string) => Promise<IBackendModel>;
  update: (payload: PartialModel) => Promise<IBackendModel>;
  upsert: (payload: NewModel | PartialModel) => Promise<IBackendModel>;
  delete: (id: string) => Promise<IBackendModel>;
}
