import ApolloClient, { gql } from "apollo-boost";

import { IUser } from "../../../../app/types";
import { IAuthInnerState } from "../../../model";
import { completeLogin, successfulGetUserDetails } from "../../creators";
import { AuthDispatch, IAuthApiAdapter } from "../../types";

// TODO: The shape of this interface may need to change to support varying
// scopes and multiple providers
interface IGraphQLSocialAuthResponse {
  data: {
    socialAuth: {
      social: {
        uid: string;
        extraData: {[key: string]: any}
        user: {
          id: string;
        }
      };
      token: string;
    };
  };
}

export class GraphQLApiAdapter implements IAuthApiAdapter {
  public static getInstance(): GraphQLApiAdapter {
    if (!GraphQLApiAdapter.singleton) {
      GraphQLApiAdapter.singleton = new GraphQLApiAdapter();
    }

    return GraphQLApiAdapter.singleton;
  }

  public static jwtTokenFromSocialAuthResponse(response: IGraphQLSocialAuthResponse): string {
    if (response.data == null || response.data.socialAuth == null || response.data.socialAuth.token == null) {
      return null;
    }

    return response.data.socialAuth.token;
  }

  public static userFromSocialAuthResponse(response: IGraphQLSocialAuthResponse): IUser {
    if (response.data == null || response.data.socialAuth == null || response.data.socialAuth.social == null) {
      return null;
    }

    const social = response.data.socialAuth.social;
    console.log(social.extraData.picture);

    return {
      id: social.user.id,
      email: social.extraData.email,
      firstName: social.extraData.firstName,
      lastName: social.extraData.lastName,
      extraData: {
        picture: social.extraData.picture,
      },
    };
  }

  private static singleton: GraphQLApiAdapter;

  private client: ApolloClient<any>;

  constructor(client: ApolloClient<any> = new ApolloClient({ uri: "/graphql/" })) {
    this.client = client;
  }

  public socialLoginAccessToken = (
    provider: string,
    accessToken: string,
    dispatch: AuthDispatch,
    _authState: IAuthInnerState,
  ) => {
    return this.client.mutate({
      mutation: gql`
        mutation {
          socialAuth(provider: "${provider}", accessToken: "${accessToken}") {
            social {
              uid
              extraData
              user {
                id
              }
            }
            token
          }
        }
      `,
    }).then((response: IGraphQLSocialAuthResponse) => {
      const jwtToken = GraphQLApiAdapter.jwtTokenFromSocialAuthResponse(response);
      if (jwtToken == null) {
        return Promise.reject("An error occurred during the authentication process.");
      }

      dispatch(completeLogin(response.data.socialAuth.token));
      dispatch(successfulGetUserDetails(GraphQLApiAdapter.userFromSocialAuthResponse(response)));
    });
  }

  public logout = () => {
    console.error("Logout is not yet implemented on GraphQLApiAdapter for AuthApi");
    return Promise.resolve();
  }
}
