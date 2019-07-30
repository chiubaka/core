import ApolloClient, { gql } from "apollo-boost";
import _ from "lodash";
import pluralize from "pluralize";

import { IBackendModel, Model, NewModel, PartialModel } from "../../model";
import { IModelApiAdapter } from "./types";

export class GraphQLApiAdapter implements IModelApiAdapter {
  public static GRAPHQL_PATH = "/graphql/";

  private client: ApolloClient<any>;
  private capitalizedModelName: string;
  private capitalizedModelNamePlural: string;
  private modelFragment: string;
  private modelName: string;
  private modelNamePlural: string;

  constructor(
    model: typeof Model,
    client: ApolloClient<any> = new ApolloClient({ uri: GraphQLApiAdapter.GRAPHQL_PATH }),
  ) {
    this.client = client;
    this.capitalizedModelName = _.upperFirst(model.modelName);
    this.capitalizedModelNamePlural = pluralize(this.capitalizedModelName);
    this.modelName = _.lowerFirst(this.capitalizedModelName);
    this.modelNamePlural = _.lowerFirst(this.capitalizedModelNamePlural);
    this.modelFragment = this.buildGraphQLFragment(model);
  }

  public list = (): Promise<IBackendModel[]> => {
    return this.client.query({
      query: this.listQuery(),
    }).then((response: any) => {
      return response.data[this.modelNamePlural];
    });
  }

  public get = (id: string): Promise<IBackendModel> => {
    return this.client.query({
      query: this.getQuery(),
      variables: {
        id,
      },
    }).then((response: any) => {
      return response.data[this.modelName];
    });
  }

  public create = (payload: NewModel): Promise<IBackendModel> => {
    return this.mutate("create", payload);
  }

  public update = (payload: PartialModel): Promise<IBackendModel> => {
    return this.mutate("update", payload);
  }

  public upsert = (payload: NewModel | PartialModel): Promise<IBackendModel> => {
    return this.mutate("upsert", payload);
  }

  public delete = (id: string): Promise<IBackendModel> => {
    return this.client.mutate({
      mutation: this.deleteMutation(),
      variables: {
        id,
      },
    }).then((response: any) => {
      return response.data[`delete${this.capitalizedModelName}`][this.modelName];
    });
  }

  private buildGraphQLFragment = (model: typeof Model) => {
    const fields = Object.keys(model.fields).reduce((accumulator, fieldName) => {
      // Skip internal values
      if (Model.isLocalField(fieldName)) {
        return accumulator;
      }
      return accumulator + `${fieldName}\n`;
    }, "");

    return gql`
      fragment ${this.capitalizedModelName}Fragment on ${this.capitalizedModelName} {
        ${fields}
      }
    `;
  }

  private mutate = (action: string, payload: NewModel | PartialModel): Promise<IBackendModel> => {
    return this.client.mutate({
      mutation: this.mutation(action),
      variables: {
        input: payload,
      },
    }).then((response: any) => {
      return response.data[`${action}${this.capitalizedModelName}`][this.modelName];
    });
  }

  private getQuery = () => {
    return gql`
      query Get${this.capitalizedModelName}($id: String!) {
        get${this.capitalizedModelName}(id: $id) {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
  }

  private listQuery = () => {
    return gql`
      query list${this.capitalizedModelNamePlural} {
        ${this.modelNamePlural} {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
  }

  private mutation = (action: string) => {
    const capitalizedAction = _.upperFirst(action);
    return gql`
      mutation ${capitalizedAction}${this.capitalizedModelName}(
        $input: ${capitalizedAction}${this.capitalizedModelName}Input!
      ) {
        ${action}${this.capitalizedModelName}(input: $input) {
          ${this.modelName} {
            ...${this.capitalizedModelName}Fragment
          }
        }
      }
      ${this.modelFragment}
    `;
  }

  private deleteMutation = () => {
    return gql`
      mutation Delete${this.capitalizedModelName}(id: String!) {
        delete${this.capitalizedModelName}(id: $id) {
          ${this.modelName} {
            ...${this.capitalizedModelName}Fragment
          }
        }
      }
    `;
  }
}
