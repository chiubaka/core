import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { IModel } from "../../app/model";
import { IAuthState } from "../../auth/model";
export declare type ApiAction<T> = ThunkAction<Promise<T>, IAuthState, void, any>;
export interface ISuccessfulListModel<T extends IModel> extends Action {
    items: T[];
}
