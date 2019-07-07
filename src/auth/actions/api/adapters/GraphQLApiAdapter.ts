import ApolloClient, { gql } from "apollo-boost";

import { IAuthInnerState } from "../../../model";
import { AuthDispatch, IAuthApiAdapter } from "../../types";

export class GraphQLApiAdapter implements IAuthApiAdapter {
  private client: ApolloClient<any>;

  constructor(client: ApolloClient<any> = new ApolloClient()) {
    this.client = client;
  }

  public socialLoginAccessToken = (
    provider: string,
    token: string,
    dispatch: AuthDispatch,
    authState: IAuthInnerState,
  ) => {
    return this.client.query({
      query: gql`
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
