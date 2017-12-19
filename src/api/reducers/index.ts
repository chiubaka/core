import { Action } from "redux";
import { IApiResponse, IApiUpdateResponse, IModel, ModelApi } from "../actions/index";
import { IModelById } from "../model/index";

export function modelApiById<T extends IModel>(Api: ModelApi<T>) {
  return (state: IModelById<T> = {}, action: Action): IModelById<T> => {
    switch (action.type) {
      case Api.SUCCESSFUL_GET_ALL_TYPE: {
        const objects = (action as IApiResponse<T[]>).payload;
        const newState = {...state};
        objects.forEach((object) => {
          newState[object.id] = object;
        });
        return newState;
      }
      case Api.SUCCESSFUL_CREATE_TYPE: {
        const object = (action as IApiResponse<T>).payload;
        const newState = {...state};
        newState[object.id] = object;
        return newState;
      }
      case Api.SUCCESSFUL_UPDATE_TYPE: {
        const object = (action as IApiUpdateResponse<T>).updated;
        const newState = {...state};
        newState[object.id] = object;
        return newState;
      }
      default:
        return state;
    }
  };
}
