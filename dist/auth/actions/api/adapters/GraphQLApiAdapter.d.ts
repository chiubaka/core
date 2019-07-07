import ApolloClient from "apollo-boost";
import { IAuthInnerState } from "../../../model";
import { IAuthApiAdapter } from "../../types";
export declare class GraphQLApiAdapter implements IAuthApiAdapter {
    private client;
    constructor(client?: ApolloClient<any>);
    socialLoginAccessToken: (provider: string, token: string, dispatch: import("redux-thunk").ThunkDispatch<import("../../../model").IAuthState, void, import("../../types").AuthAction>, authState: IAuthInnerState) => Promise<void>;
    logout: () => Promise<void>;
}
