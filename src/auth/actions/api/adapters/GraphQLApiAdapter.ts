import ApolloClient, { gql } from "apollo-boost";

import { IAuthInnerState } from "../../../model";
import { AuthDispatch, IAuthApiAdapter } from "../../types";

export class GraphQLApiAdapter implements IAuthApiAdapter {
  public static getInstance(): GraphQLApiAdapter {
    if (!GraphQLApiAdapter.singleton) {
      GraphQLApiAdapter.singleton = new GraphQLApiAdapter();
    }

    return GraphQLApiAdapter.singleton;
  }

  private static singleton: GraphQLApiAdapter;

  private client: ApolloClient<any>;

  constructor(client: ApolloClient<any> = new ApolloClient({ uri: "/graphql/" })) {
    this.client = client;
  }

  public socialLoginAccessToken = (
    provider: string,
    token: string,
    dispatch: AuthDispatch,
    authState: IAuthInnerState,
  ) => {
    return this.client.mutate({
      mutation: gql`
        mutation {
          socialAuth(provider: "${provider}", accessToken: "${token}") {
            social {
              uid
            }
            token
          }
        }
      `,
    }).then((response) => {
      console.log(response);
    });
  }

  public logout = () => {
    console.error("Logout is not yet implemented on GraphQLApiAdapter for AuthApi");
    return Promise.resolve();
  }
}
