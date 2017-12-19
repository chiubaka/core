import * as HttpStatus from "http-status-codes";
import { push } from "react-router-redux";
import { Action, Dispatch } from "redux";

import { IAuthState } from "../../auth/model/AuthenticationState";

export declare type ApiSuccessCallback<T> = (dispatch: Dispatch<IAuthState>, response: T) => void;

export interface IApiResponse<T> extends Action {
  payload: T;
}

export interface IApiUpdateResponse<T> extends Action {
  original: T;
  updated: T;
}

export interface IApiErrorResponse extends Action {
  reason: string;
}

export interface IModel {
  id?: number;
}

export class ModelApi<T extends IModel> {
  public static UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";

  public static unsuccessfulApiRequest(reason: string) {
    return {
      type: ModelApi.UNSUCCESSFUL_API_REQUEST_TYPE,
      reason,
    };
  }

  private static API_PATH = "/api";

  private static handleApiResponse<T>(dispatch: Dispatch<IAuthState>, response: Response): Promise<T> {
    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        return Promise.resolve(response.json());
      case HttpStatus.UNAUTHORIZED:
        dispatch(push("/auth/logout"));
        return Promise.reject("You are not logged in.");
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.INTERNAL_SERVER_ERROR:
      case HttpStatus.GATEWAY_TIMEOUT:
        return Promise.reject("An unexpected error has occurred. Please try again later.");
      default:
        return Promise.reject(`Received unexpected status code ${response.status}`);
    }
  }

  public SUCCESSFUL_GET_ALL_TYPE: string;
  public SUCCESSFUL_GET_TYPE: string;
  public SUCCESSFUL_CREATE_TYPE: string;
  public SUCCESSFUL_UPDATE_TYPE: string;

  private getAccessToken: () => string;
  private endpoint: string;

  constructor(modelName: string) {
    this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${modelName.toUpperCase()}S`;
    this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelName.toUpperCase()}`;
    this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelName.toUpperCase()}`;
    this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelName.toUpperCase()}`;
    this.endpoint = `${ModelApi.API_PATH}/${modelName.toLowerCase()}s/`;
  }

  public initialize(accessTokenGetter: () => string) {
    this.getAccessToken = accessTokenGetter;
  }

  public getAll() {
    return this.getRequest(this.endpoint, (dispatch, response: T[]) => {
      dispatch(this.successfulGetAllAction(response));
    });
  }

  public get(id: number) {
    return this.getRequest(`${this.endpoint}${id}/`, (dispatch, response: T) => {
      dispatch(this.successfulGetAction(response));
    });
  }

  public create(payload: T) {
    return this.postRequest(this.endpoint, payload, (dispatch, response: T) => {
      dispatch(this.successfulCreateAction(payload));
    });
  }

  public update(original: T, updated: T) {
    return this.putRequest(
      `${this.endpoint}${updated.id}`,
      updated,
      (dispatch, response: T) => {
        dispatch(this.successfulUpdateAction(original, response));
      },
    );
  }

  public successfulGetAllAction(payload: T[]) {
    return {
      type: this.SUCCESSFUL_GET_ALL_TYPE,
      payload,
    };
  }

  public successfulGetAction(payload: T) {
    return {
      type: this.SUCCESSFUL_GET_TYPE,
      payload,
    };
  }

  public successfulCreateAction(payload: T) {
    return {
      type: this.SUCCESSFUL_CREATE_TYPE,
      payload,
    };
  }

  public successfulUpdateAction(original: T, updated: T) {
    return {
      type: this.SUCCESSFUL_UPDATE_TYPE,
      original,
      updated,
    };
  }

  private getRequest<ResponseType= T | T[]>(pathname: string, onSuccess: ApiSuccessCallback<ResponseType>) {
    return this.apiRequest(pathname, onSuccess);
  }

  private postRequest(pathname: string, payload: T, onSuccess: ApiSuccessCallback<T>) {
    return this.apiRequestWithPayload(pathname, payload, "POST", onSuccess);
  }

  private putRequest(pathname: string, payload: T, onSuccess: ApiSuccessCallback<T>) {
    return this.apiRequestWithPayload(pathname, payload, "PUT", onSuccess);
  }
  private apiRequestWithPayload(pathname: string, payload: T, method: "POST" | "PUT",
                                onSuccess: ApiSuccessCallback<T>) {
    return this.apiRequest(pathname, onSuccess, {
      method,
      body: JSON.stringify(payload),
    });
  }

  private apiRequest<ResponseType>(pathname: string, onSuccess: ApiSuccessCallback<ResponseType>,
                                   requestOptions: RequestInit = {}) {
    return (dispatch: Dispatch<IAuthState>) => {
      return fetch(pathname, {
        headers: this.apiHeaders(),
        ...requestOptions,
      })
        .then<T>(ModelApi.handleApiResponse.bind(this, dispatch))
        .then(onSuccess.bind(this, dispatch), (reason) => {
          dispatch(ModelApi.unsuccessfulApiRequest(reason));
        });
    };
  }

  private apiHeaders() {
    const headers = new Headers();
    if (this.getAccessToken) {
      headers.append("Authorization", `JWT ${this.getAccessToken()}`);
    }
    headers.append("Content-Type", "application/json");
    return headers;
  }
}
