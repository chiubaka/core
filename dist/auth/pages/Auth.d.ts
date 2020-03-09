import { IAuthApiAdapter } from "../actions";
interface IAuthOwnProps {
    adapter?: IAuthApiAdapter;
}
export declare const Auth: import("react-redux").ConnectedComponentClass<any, Pick<unknown, never> & IAuthOwnProps>;
export {};
