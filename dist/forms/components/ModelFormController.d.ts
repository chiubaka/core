import * as React from "react";
import { IModel, ModelApi } from "../../api";
import { IModelFormProps } from "../types";
export interface IModelFormControllerDispatchProps<T> {
    onSubmit: (original: Partial<T>, updated: Partial<T>) => Promise<T>;
}
export interface IModelFormControllerOwnProps<T> {
    model?: Partial<T>;
}
export interface IModelFormControllerProps<T> extends IModelFormControllerDispatchProps<T>, IModelFormControllerOwnProps<T> {
}
export interface IModelFormControllerState<T> {
    model: Partial<T>;
}
export interface IModelFormControllerComponentProps<T> extends IModelFormProps<T> {
    onSubmit: () => Promise<T>;
    onFormReset: () => void;
}
export declare function withModelFormController<TProps, TModel extends IModel, TOwnProps = TProps>(WrappedComponent: React.ComponentType<IModelFormControllerComponentProps<TModel>>, Api: ModelApi<TModel>, defaultModelState?: Partial<TModel>): import("react-redux").ConnectedComponentClass<any, Pick<unknown, never> & IModelFormControllerOwnProps<TModel> & TOwnProps>;
