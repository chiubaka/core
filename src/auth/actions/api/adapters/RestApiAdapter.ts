import { RestClient } from "../../../../api/clients/RestClient";
import { IJwtUserResponse, IUser } from "../../../../app/types";
import { AuthRestClient } from "../../../clients/AuthRestClient";
import { IAuthInnerState } from "../../../model";
import { completeLogin, successfulGetUserDetails } from "../../creators";
import { AuthDispatch, IAuthApiAdapter } from "../../types";

export class RestApiAdapter implements IAuthApiAdapter {
  public static getInstance(): RestApiAdapter {
    if (!RestApiAdapter.singleton) {
      RestApiAdapter.singleton = new RestApiAdapter();
    }

    return RestApiAdapter.singleton;
  }

  private static singleton: RestApiAdapter;

  private static userFromJwtUserResponse(response: IJwtUserResponse): IUser {
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    };
  }

  private client: RestClient;

  constructor(client: RestClient = new AuthRestClient()) {
    this.client = client;
  }

  public login = (username: string, password: string, dispatch: AuthDispatch, authState: IAuthInnerState) => {
    const innerPayload = authState.useEmailAsUsername
      ? { email: username, password }
      : { username, password };

    // Some auth systems expect parameters in the form:
    // {
    //   user: {
    //     email: test@test.com
    //     password: testtest
    //   }
    // }
    const payload = authState.wrapParameters
      ? { user: innerPayload }
      : innerPayload;
    return this.client.postRequest("/api/login/username/jwt/", payload, dispatch, null)
      .then((response: IJwtUserResponse) => {
        if (response) {
          if (response.token) {
            dispatch(completeLogin(response.token));
          }
          if (response.email) {
            const user = RestApiAdapter.userFromJwtUserResponse(response);
            dispatch(successfulGetUserDetails(user));
          } else {
            // TODO: Should really fix the Django server so that it returns the user details
            // with the tokens--that would allow elimination of this branching code path.
            // Have to grab new state because we've just updated through dispatch, in theory
            const token = authState.token;
            return this.client.getRequest("/api/users/me/", null, dispatch, token)
            .then((userDetailsResponse: IUser) => {
              dispatch(successfulGetUserDetails(userDetailsResponse));
            });
          }
        }
      });
  }

  public socialLogin = (provider: string, code: string, redirectUri: string, dispatch: AuthDispatch, authState: IAuthInnerState) => {
    const payload = {
      provider,
      code,
      redirect_uri: redirectUri,
    };
    return this.client.postRequest("/api/login/social/jwt_user/", payload, dispatch, authState.token)
      .then((response: IJwtUserResponse) => {
        const user = RestApiAdapter.userFromJwtUserResponse(response);
        dispatch(completeLogin(response.token));
        dispatch(successfulGetUserDetails(user));
      });
  }

  public logout = (dispatch: AuthDispatch, authState: IAuthInnerState) => {
    return this.client.deleteRequest("/api/logout/jwt/", dispatch, authState.token);
  }
}
