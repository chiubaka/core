import * as HttpStatus from "http-status-codes";

import { IRestApiError, RestClient } from "../../api/clients/RestClient";
import { completeLogin, failLogin } from "../actions/creators";
import { AuthDispatch as Dispatch } from "../actions/types";

export class AuthRestClient extends RestClient {
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
