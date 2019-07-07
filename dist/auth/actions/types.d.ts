import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IUser } from "../../app/types";
import { IAuthState, IAuthInnerState } from "../model";
export declare const ActionTypes: {
    START_LOGIN: "START_LOGIN";
    COMPLETE_LOGIN: "COMPLETE_LOGIN";
    SUCCESSFUL_GET_USER_DETAILS: "SUCCESSFUL_GET_USER_DETAILS";
    FAIL_LOGIN: "FAIL_LOGIN";
    START_LOGOUT: "START_LOGOUT";
    COMPLETE_LOGOUT: "COMPLETE_LOGOUT";
    SET_REDIRECT: "SET_REDIRECT";
    CLEAR_REDIRECT: "CLEAR_REDIRECT";
};
export interface ICompleteLogin extends Action {
    token: string;
}
export interface ISuccessfulGetUserDetails extends Action {
    user: IUser;
}
export interface IFailLogin extends Action {
    error: string;
}
export interface ISetRedirect extends Action {
    redirectPath: string;
}
export declare type AuthAction = Action | ICompleteLogin | ISuccessfulGetUserDetails | IFailLogin | ISetRedirect;
export declare type AuthDispatch = ThunkDispatch<IAuthState, void, AuthAction>;
export interface IAuthApiAdapter {
    login: (username: string, password: string, dispatch: AuthDispatch, authState: IAuthInnerState) => Promise<any>;
    socialLogin: (provider: string, code: string, redirectUri: string, dispatch: AuthDispatch, authState: IAuthInnerState) => Promise<any>;
    logout: (dispatch: AuthDispatch, authState: IAuthInnerState) => Promise<any>;
}
