import * as HttpStatus from "http-status-codes";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { completeLogoutAndRedirect } from "../../auth/actions/index";
import { IAuthState } from "../../auth/model/AuthenticationState";

export declare type ApiSuccessCallback<T> = (dispatch: Dispatch<IAuthState>, response: T) => void;
export declare type ApiAction<T> = ThunkAction<Promise<T>, IAuthState, null>;
export declare type ResponseTransformer<BackendType, FrontendType> = (response: BackendType) => FrontendType;
export declare type PayloadTransformer<BackendType, FrontendType> = (payload: FrontendType) => BackendType;

export interface IApiError {[field: string]: string[]; }

export class Api {
  public static UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";

  public static unsuccessfulRequest(reason: string) {
    return {
      type: Api.UNSUCCESSFUL_API_REQUEST_TYPE,
      reason,
    };
  }

  // TODO: authPrefix should be customizable based on app configs somehow
  public static apiHeaders(accessToken: string, authPrefix: string = "Bearer") {
    const headers = new Headers();
    if (accessToken) {
      headers.append("Authorization", `${authPrefix} ${accessToken}`);
    }
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

  protected getActionCreator<BackendT, FrontendT = BackendT>(pathname: string,
                                                             onSuccess: ApiSuccessCallback<FrontendT>,
                                                             // tslint:disable-next-line:max-line-length
                                                             responseTransformer?: ResponseTransformer<BackendT, FrontendT>):
                                                             ApiAction<FrontendT> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      return this.getRequest(pathname, dispatch, getState().auth.token)
        .then((response: BackendT) => {
          const transformedResponse = responseTransformer ? responseTransformer(response) : response as any;
          onSuccess(dispatch, transformedResponse);
          return transformedResponse;
        });
    };
  }

  protected getRequest(pathname: string, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.request(pathname, dispatch, token);
  }

  protected postActionCreator<BackendT, FrontendT = BackendT>(pathname: string, payload: FrontendT,
                                                              onSuccess: ApiSuccessCallback<FrontendT>,
                                                              /* tslint:disable:max-line-length */
                                                              payloadTransformer?: PayloadTransformer<BackendT, FrontendT>,
                                                              responseTransformer?: ResponseTransformer<BackendT, FrontendT>):
                                                              /* tslint:emnable:max-line-length */
                                                              ApiAction<FrontendT> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      const transformedPayload = payloadTransformer ? payloadTransformer(payload) : payload as any;
      return this.postRequest(pathname, transformedPayload, dispatch, getState().auth.token)
        .then((response: BackendT) => {
          const transformedResponse = responseTransformer ? responseTransformer(response) : response as any;
          onSuccess(dispatch, transformedResponse);
          return transformedResponse;
        });
    };
  }

  protected postRequest<T>(pathname: string, payload: T, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.requestWithPayload(pathname, payload, "POST", dispatch, token);
  }

  protected putActionCreator<BackendT, FrontendT = BackendT>(pathname: string, payload: FrontendT,
                                                             onSuccess: ApiSuccessCallback<FrontendT>,
                                                             /* tslint:disable:max-line-length */
                                                             payloadTransformer?: PayloadTransformer<BackendT, FrontendT>,
                                                             responseTransformer?: ResponseTransformer<BackendT, FrontendT>):
                                                             /* tslint:emnable:max-line-length */
                                                             ApiAction<FrontendT> {
    return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
      const transformedPayload = payloadTransformer ? payloadTransformer(payload) : payload as any;
      return this.putRequest(pathname, transformedPayload, dispatch, getState().auth.token)
        .then((response: BackendT) => {
          const transformedResponse = responseTransformer ? responseTransformer(response) : response as any;
          onSuccess(dispatch, transformedResponse);
          return transformedResponse;
        });
    };
  }

  protected putRequest<T>(pathname: string, payload: T, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.requestWithPayload(pathname, payload, "PUT", dispatch, token);
  }

  protected deleteRequest(pathname: string, dispatch: Dispatch<IAuthState>, token: string): Promise<any> {
    return this.request(pathname, dispatch, token, {
      method: "DELETE",
    });
  }

  protected handleApiResponse<T>(dispatch: Dispatch<IAuthState>, response: Response): Promise<T | string> {
    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        return response.json();
      case HttpStatus.UNAUTHORIZED:
        dispatch(completeLogoutAndRedirect());
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
}
