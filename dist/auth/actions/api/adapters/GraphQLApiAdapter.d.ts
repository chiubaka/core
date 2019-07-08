import ApolloClient from "apollo-boost";
import { IUser } from "../../../../app/types";
import { IAuthInnerState } from "../../../model";
import { IAuthApiAdapter } from "../../types";
interface IGraphQLSocialAuthResponse {
    data: {
        socialAuth: {
            social: {
                uid: string;
                extraData: {
                    [key: string]: any;
                };
                user: {
                    id: string;
                };
            };
            token: string;
        };
    };
}
export declare class GraphQLApiAdapter implements IAuthApiAdapter {
    static getInstance(): GraphQLApiAdapter;
    static jwtTokenFromSocialAuthResponse(response: IGraphQLSocialAuthResponse): string;
    static userFromSocialAuthResponse(response: IGraphQLSocialAuthResponse): IUser;
    private static singleton;
    private client;
    constructor(client?: ApolloClient<any>);
    socialLoginAccessToken: (provider: string, accessToken: string, dispatch: import("redux-thunk").ThunkDispatch<import("../../../model").IAuthState, void, import("../../types").AuthAction>, _authState: IAuthInnerState) => Promise<never>;
    logout: () => Promise<void>;
}
export {};
