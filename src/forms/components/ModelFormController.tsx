import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IModel, ModelApi } from "../../api";
import { IModelFormProps } from "../types";

export interface IModelFormControllerDispatchProps<T> {
  onSubmit: (original: Partial<T>, updated: Partial<T>) => Promise<T>;
}

export interface IModelFormControllerOwnProps<T> {
  model?: Partial<T>;
}

export interface IModelFormControllerProps<T> extends IModelFormControllerDispatchProps<T>,
  IModelFormControllerOwnProps<T> {}

export interface IModelFormControllerState<T> {
  model: Partial<T>;
}

export interface IModelFormControllerComponentProps<T>  extends IModelFormProps<T> {
  onSubmit: () => Promise<T>;
  onFormReset: () => void;
}

export function withModelFormController<TProps, TModel extends IModel, TOwnProps = TProps>(
  WrappedComponent: React.ComponentType<TProps & IModelFormControllerComponentProps<TModel>>,
  Api: ModelApi<TModel>,
  defaultModelState: Partial<TModel> = {},
) {
  class ModelFormController extends
    React.Component<IModelFormControllerProps<TModel>, IModelFormControllerState<TModel>> {
    constructor(props: IModelFormControllerProps<TModel>) {
      super(props);

      this.state = {
        model: {...defaultModelState as object, ...props.model as object},
      };

      this.updateModelState = this.updateModelState.bind(this);
      this.submitForm = this.submitForm.bind(this);
      this.resetForm = this.resetForm.bind(this);
    }

    public render(): JSX.Element {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onModelDetailsUpdate={this.updateModelState}
          onSubmit={this.submitForm}
          onFormReset={this.resetForm}
        />
      );
    }

    private updateModelState(model: Partial<TModel>) {
      this.setState({
        ...this.state,
        model: {
          ...this.state.model as object,
          ...model as object,
        },
      });
    }

    private submitForm() {
      return this.props.onSubmit(this.props.model, this.state.model).then((model) => {
        return model;
      });
    }

    private resetForm() {
      this.setState({model: defaultModelState});
    }
  }

  function mapDispatchToProps(dispatch: Dispatch<any>): IModelFormControllerDispatchProps<TModel> {
    return {
      onSubmit: (original: Partial<TModel>, updated: Partial<TModel>) => {
        const promise =  dispatch(Api.createOrUpdate(original, updated)).then((model) => {
          return model;
        });
        return promise;
      },
    };
  }

  return connect<
    null,
    IModelFormControllerDispatchProps<TModel>,
    IModelFormControllerOwnProps<TModel> & TOwnProps
  >(null, mapDispatchToProps)(ModelFormController);
}
