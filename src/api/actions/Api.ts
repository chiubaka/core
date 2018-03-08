import * as HttpStatus from "http-status-codes";
import { push } from "react-router-redux";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { completeLogout } from "../../auth/actions";
import { IAuthState } from "../../auth/model/AuthenticationState";

export declare type ApiSuccessCallback<T> = (dispatch: Dispatch<IAuthState>, response: T) => void;
export declare type ApiAction<T> = ThunkAction<Promise<T>, IAuthState, null>;
export interface IApiError {[field: string]: string[]; }

export class Api {
  public static UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";

  public static unsuccessfulRequest(reason: string) {
    return {
      type: Api.UNSUCCESSFUL_API_REQUEST_TYPE,
      reason,
    };
  }

  public static apiHeaders(accessToken: string) {
    const headers = new Headers();
    headers.append("Authorization", `JWT ${accessToken}`);
    headers.append("Content-Type", "application/json");
    return headers;
  }

  protected errorTransformer(_url: string, error: IApiError): Promise<string> {
    let errorMessage = "";
    for (const field in error) {
      if (error.hasOwnProperty(field)) {
        error[field].forEach((message) => {
          errorMessage += message + " ";
        });
      }
    }
    return Promise.reject(errorMessage.trim());
  }

  protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch<IAuthState>) {
    dispatch(Api.unsuccessfulRequest(reason));
  }

  protected getActionCreator<T>(pathname: string, onSuccess: ApiSuccessCallback<T>): ApiAction<T> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      return this.getRequest(pathname, dispatch, getState().auth.token)
        .then((response: T) => {
          onSuccess(dispatch, response);
          return response;
        });
    };
  }

  protected getRequest(pathname: string, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.request(pathname, dispatch, token);
  }

  protected postActionCreator<T>(pathname: string, payload: T, onSuccess: ApiSuccessCallback<T>): ApiAction<T> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      return this.postRequest(pathname, payload, dispatch, getState().auth.token)
        .then((response: T) => {
          onSuccess(dispatch, response);
          return response;
        });
    };
  }

  protected postRequest<T>(pathname: string, payload: T, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.requestWithPayload(pathname, payload, "POST", dispatch, token);
  }

  protected putActionCreator<T>(pathname: string, payload: T, onSuccess: ApiSuccessCallback<T>): ApiAction<T> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      return this.putRequest(pathname, payload, dispatch, getState().auth.token)
        .then((response: T) => {
          onSuccess(dispatch, response);
          return response;
        });
    };
  }

  protected putRequest<T>(pathname: string, payload: T, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.requestWithPayload(pathname, payload, "PUT", dispatch, token);
  }

  private requestWithPayload<T>(pathname: string, payload: T, method: "POST" | "PUT",
                                dispatch: Dispatch<IAuthState>, token: string) {
    return this.request(pathname, dispatch, token, {
      method,
      body: JSON.stringify(payload),
    });
  }

  private request(pathname: string, dispatch: Dispatch<IAuthState>, token: string,
                  requestOptions: RequestInit = {}): Promise<any> {
    return fetch(pathname, {
      headers: Api.apiHeaders(token),
      ...requestOptions,
    })
    .then((response) => {
      return this.handleApiResponse<ResponseType>(dispatch, response);
    })
    .catch((reason) => {
      this.handleUnsuccessfulRequest(reason, dispatch);
      return Promise.reject(reason);
    });
  }

  private handleApiResponse<T>(dispatch: Dispatch<IAuthState>, response: Response): Promise<T | string> {
    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        return response.json();
      case HttpStatus.UNAUTHORIZED:
        dispatch(completeLogout());
        dispatch(push("/auth/login", {
          redirectPath: "/app",
        }));
        return Promise.reject("You are not logged in.");
      case HttpStatus.BAD_REQUEST:
        return response.json().then(this.errorTransformer.bind(this, response.url));
      case HttpStatus.INTERNAL_SERVER_ERROR:
      case HttpStatus.GATEWAY_TIMEOUT:
        return Promise.reject("An unexpected error has occurred. Please try again later.");
      default:
        return Promise.reject(`Received unexpected status code ${response.status}`);
    }
  }
}
