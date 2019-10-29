import { ORM } from "redux-orm";
import { IBackendModel, IModel, Model, NewModel, PartialModel } from "../model";
import { IModelApiAdapter } from "./adapters/types";
import { IApiRequestOptions } from "./types";
interface IOrmModelApiOptions {
    adapter?: IModelApiAdapter;
    adapterOptions?: any;
}
export declare class OrmModelApi<T extends IModel> {
    model: typeof Model;
    orm: ORM;
    private adapter;
    constructor(model: typeof Model, orm: ORM, options?: IOrmModelApiOptions);
    list: (options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel[]>, any, null, import("redux").Action<any>>;
    search: (searchTerm: string, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel[]>, any, null, import("redux").Action<any>>;
    get: (id: string, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel>, any, null, import("redux").Action<any>>;
    create: (payload: NewModel<IModel>, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel>, any, null, import("redux").Action<any>>;
    update: (payload: PartialModel<IModel>, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel>, any, null, import("redux").Action<any>>;
    sync: (id: string, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel>, any, null, import("redux").Action<any>>;
    delete: (id: string, options?: IApiRequestOptions) => import("redux-thunk").ThunkAction<Promise<IBackendModel>, any, null, import("redux").Action<any>>;
}
export {};
