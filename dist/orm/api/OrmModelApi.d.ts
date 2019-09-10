import { ORM } from "redux-orm";
import { IModel, IOrmState, Model } from "../model";
import { IModelApiAdapter } from "./adapters/types";
export declare class OrmModelApi<T extends IModel> {
    model: typeof Model;
    orm: ORM;
    private adapter;
    constructor(model: typeof Model, orm: ORM, adapter?: IModelApiAdapter);
    list: () => (dispatch: import("redux-thunk").ThunkDispatch<any, void, any>) => Promise<void>;
    sync: (id: string) => (dispatch: import("redux-thunk").ThunkDispatch<any, void, any>, getState: () => IOrmState) => Promise<void>;
}
