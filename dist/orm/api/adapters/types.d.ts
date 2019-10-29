import { IBackendModel, NewModel, PartialModel } from "../../model";
import { IApiRequestOptions } from "../types";
export interface IModelApiAdapter {
    create: (payload: NewModel, options?: IApiRequestOptions) => Promise<IBackendModel>;
    list: (options?: IApiRequestOptions) => Promise<IBackendModel[]>;
    search?: (searchTerm: string, options?: IApiRequestOptions) => Promise<IBackendModel[]>;
    get: (id: string, options?: IApiRequestOptions) => Promise<IBackendModel>;
    update: (payload: PartialModel, options?: IApiRequestOptions) => Promise<IBackendModel>;
    upsert: (payload: NewModel | PartialModel, options?: IApiRequestOptions) => Promise<IBackendModel>;
    delete: (id: string, options?: IApiRequestOptions) => Promise<IBackendModel>;
}
