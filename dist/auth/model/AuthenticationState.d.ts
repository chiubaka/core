import { ISocialLoginProvider, IUser } from "../../app/types/index";
export declare enum LoginState {
    NotLoggedIn = 0,
    LoggingIn = 1,
    LoggedIn = 2,
    LoggingOut = 3
}
export interface IAuthState {
    auth: IAuthInnerState;
}
export interface IAuthInnerState {
    token?: string;
    user?: IUser;
    loginState: LoginState;
    oAuth2CallbackBasePath: string;
    socialProviders: ISocialLoginProvider[];
    enableNonSocialLogin: boolean;
    useEmailAsUsername: boolean;
    wrapParameters: boolean;
    redirectPath?: string;
}
export declare const DEFAULT_AUTH_STATE: IAuthInnerState;
export declare function getExistingAuthState(overrideState: Partial<IAuthInnerState>): {
    token: string;
    user: IUser;
    loginState: LoginState;
    oAuth2CallbackBasePath: string;
    socialProviders: ISocialLoginProvider[];
    enableNonSocialLogin: boolean;
    useEmailAsUsername: boolean;
    wrapParameters: boolean;
    redirectPath: any;
};
