import { RouteComponentProps } from "react-router-dom";
import { AuthApi } from "../../actions";
import { ISocialLoginProvider } from "../../model/AuthenticationState";
export interface ILoginPageStateProps {
    loggedIn: boolean;
    logoPath?: string;
    productName: string;
    socialProviders: ISocialLoginProvider[];
    enableNonSocialLogin: boolean;
    useEmailAsUsername: boolean;
}
export interface ILoginPageDispatchProps {
    dispatchLogin: (api: AuthApi, username: string, password: string) => void;
    setRedirect: (redirectPath: string) => void;
}
export interface ILoginPageMergeProps {
    onSubmitLogin: (username: string, password: string) => void;
}
export interface ILoginPageOwnProps extends RouteComponentProps<any> {
    api: AuthApi;
    defaultRedirectPath?: string;
}
export interface ILoginPageProps extends ILoginPageStateProps, Omit<ILoginPageDispatchProps, "dispatchLogin">, ILoginPageMergeProps, Omit<ILoginPageOwnProps, "api"> {
}
export interface ILoginPageState {
    username: string;
    password: string;
    showSocialLogin: boolean;
}
export declare const LoginPage: import("react-redux").ConnectedComponentClass<any, Pick<unknown, never> & ILoginPageOwnProps>;
