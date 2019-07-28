import * as HttpStatus from "http-status-codes";

import { IRestApiError, RestClient } from "../../api/clients/RestClient";
import { completeLogin, failLogin } from "../actions/creators";
import { AuthDispatch as Dispatch } from "../actions/types";

export class AuthRestClient extends RestClient {
  // TODO: Some code smell here around having to rename the singleton private var
  // Had to do this because apparently otherwise the type conflicts with the
  // super class... and then I was concerned that I'd accidentally get one instance
  // between this class and the super.
  public static getInstance() {
    if (!AuthRestClient.authSingleton) {
      AuthRestClient.authSingleton = new AuthRestClient();
    }

    return AuthRestClient.authSingleton;
  }

  private static authSingleton: AuthRestClient;

  protected errorTransformer(_url: string, _error: IRestApiError): Promise<string> {
    return Promise.reject("Invalid credentials.");
  }

  protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch) {
    super.handleUnsuccessfulRequest(reason, dispatch);
    dispatch(failLogin(reason));
  }

  protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string> {
    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        // Handle pulling the JWT token out of the headers if it appears there.
        const authorizationHeader = response.headers.get("Authorization");
        if (authorizationHeader !== null) {
          const token = authorizationHeader.split(" ")[1];
          dispatch(completeLogin(token));
        }
        return super.handleApiResponse(dispatch, response);
      case HttpStatus.NO_CONTENT:
        return Promise.resolve("Successfully logged out.");
      case HttpStatus.UNAUTHORIZED:
        return Promise.reject("Invalid credentials.");
      default:
        super.handleApiResponse(dispatch, response);
    }

    return super.handleApiResponse(dispatch, response);
  }
}
