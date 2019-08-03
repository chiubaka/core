import { gql, InMemoryCache } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import _ from "lodash";
import pluralize from "pluralize";

import { getToken } from "../../../auth/utils/storage";
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

  constructor(model: typeof Model, client?: ApolloClient<any>) {
    this.client = client || this.buildDefaultClient();
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

  private buildDefaultClient = () => {
    const httpLink = createHttpLink({
      uri: GraphQLApiAdapter.GRAPHQL_PATH,
    });

    const authLink = setContext((_unused, { headers }) => {
      const token = getToken();
      return {
        headers: {
          ...headers,
          Authorization: token != null ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
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
      query Get${this.capitalizedModelName}($id: ID!) {
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
      mutation Delete${this.capitalizedModelName}(id: ID!) {
        delete${this.capitalizedModelName}(id: $id) {
          ${this.modelName} {
            ...${this.capitalizedModelName}Fragment
          }
        }
      }
    `;
  }
}
