import { ThunkAction } from "redux-thunk";
import { IAuthState } from "../../auth/model";
export declare type ApiAction<T> = ThunkAction<Promise<T>, IAuthState, void, any>;
