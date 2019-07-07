import { RouteComponentProps } from "react-router-dom";
import { ISocialLoginProvider } from "../../../app/types";
import { AuthApi } from "../../actions";
export interface ILoginPageStateProps {
    loggedIn: boolean;
    logoPath?: string;
    productName: string;
    socialProviders: ISocialLoginProvider[];
    enableNonSocialLogin: boolean;
    useEmailAsUsername: boolean;
}
export interface ILoginPageDispatchProps {
    onSubmitLogin: (username: string, password: string) => void;
    setRedirect: (redirectPath: string) => void;
}
export interface ILoginPageOwnProps extends RouteComponentProps<any> {
    defaultRedirectPath?: string;
}
export interface ILoginPageProps extends ILoginPageStateProps, ILoginPageDispatchProps, ILoginPageOwnProps {
}
export interface ILoginPageState {
    username: string;
    password: string;
    showSocialLogin: boolean;
}
export declare function buildLoginPage(api: AuthApi): import("react-redux").ConnectedComponentClass<any, Pick<unknown, never>>;
