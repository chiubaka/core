/* tslint:disable:no-unused-variable */
import { Dispatch } from "redux";
import { IAuthState } from "../../auth/model/AuthenticationState";
/* tslint:enable:no-unused-variable */

import { Api, ApiAction } from "./Api";
import { IModel } from "./index";

export class ModelApi<T extends IModel> extends Api {
    private static API_PATH = "/api";

    public SUCCESSFUL_GET_ALL_TYPE: string;
    public SUCCESSFUL_GET_TYPE: string;
    public SUCCESSFUL_CREATE_TYPE: string;
    public SUCCESSFUL_UPDATE_TYPE: string;

    private endpoint: string;

    constructor(modelName: string) {
      super();
      this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${modelName.toUpperCase()}S`;
      this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelName.toUpperCase()}`;
      this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelName.toUpperCase()}`;
      this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelName.toUpperCase()}`;
      this.endpoint = `${ModelApi.API_PATH}/${modelName.toLowerCase()}s/`;
    }

    public getAll(): ApiAction<T[]> {
      return this.getActionCreator(this.endpoint, (dispatch, response: T[]) => {
        dispatch(this.successfulGetAllAction(response));
      });
    }

    public get(id: number): ApiAction<T> {
      return this.getActionCreator(`${this.endpoint}${id}/`, (dispatch, response: T) => {
        dispatch(this.successfulGetAction(response));
      });
    }

    public create(payload: Partial<T>): ApiAction<T> {
      return this.postActionCreator(this.endpoint, payload, (dispatch, response: T) => {
        dispatch(this.successfulCreateAction(response));
      }) as ApiAction<T>;
    }

    public update(original: T, updated: T): ApiAction<T> {
      return this.putActionCreator(`${this.endpoint}${updated.id}/`, updated, (dispatch, response: T) => {
        dispatch(this.successfulUpdateAction(original, response));
      });
    }

    public createOrUpdate(original: Partial<T>, updated: Partial<T>): ApiAction<T> {
      if (original.id) {
        return this.update(original as T, updated as T);
      } else {
        return this.create(updated);
      }
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
  }
