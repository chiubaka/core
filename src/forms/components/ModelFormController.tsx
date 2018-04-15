import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ModelApi } from "../../api";
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
}

export function withModelFormController<TProps, TModel extends {id?: number}, TOwnProps = TProps>(
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
      this.onSubmit = this.onSubmit.bind(this);
    }

    public render(): JSX.Element {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onModelDetailsUpdate={this.updateModelState}
          onSubmit={this.onSubmit}
        />
      );
    }

    public updateModelState(model: Partial<TModel>) {
      this.setState({
        ...this.state,
        model: {
          ...this.state.model as object,
          ...model as object,
        },
      });
    }

    public onSubmit() {
      return this.props.onSubmit(this.props.model, this.state.model).then((model) => {
        return model;
      });
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

  return connect(null, mapDispatchToProps)(ModelFormController);
}
