import { Action } from "redux";
import { IUser } from "../../app/types/index";
import { ICompleteLogin, IFailLogin, ISetRedirect, ISuccessfulGetUserDetails } from "./types";
export declare function startLogin(): {
    type: "START_LOGIN";
};
export declare function completeLogin(token: string): ICompleteLogin;
export declare function successfulGetUserDetails(user: IUser): ISuccessfulGetUserDetails;
export declare function failLogin(error: string): IFailLogin;
export declare function completeLogout(): Action;
export declare function setRedirect(redirectPath: string): ISetRedirect;
export declare function clearRedirect(): Action;
