import { gql, InMemoryCache } from "apollo-boost";
import { ApolloClient, MutationOptions, QueryOptions } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import _ from "lodash";
import pluralize from "pluralize";

import { getToken } from "../../../auth/utils/storage";
import { IBackendModel, Model, NewModel, PartialModel } from "../../model";
import { IApiRequestOptions } from "../types";
import { IModelApiAdapter } from "./types";

interface ICustomQueries {
  list?: any;
  search?: any;
  get?: any;
}

interface ICustomMutations {
  [action: string]: any;
  create?: any;
  update?: any;
  upsert?: any;
  delete?: any;
}

interface IGraphQLApiAdapterOptions {
  client?: ApolloClient<any>;
  // In simple cases, the adapter can build a Fragment for the model automatically.
  // However, if any kind of nesting is involved, a fragment must be provided by
  // the user.
  modelFragment?: any;
  customQueries?: ICustomQueries;
  customMutations?: ICustomMutations;
}

export class GraphQLApiAdapter implements IModelApiAdapter {
  public static GRAPHQL_PATH = "/graphql/";

  public static get defaultClient() {
    if (this._defaultClient == null) {
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

      this._defaultClient = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      });
    }

    return this._defaultClient;
  }

  private static _defaultClient: ApolloClient<any>;

  public readonly modelFragment: string;

  private client: ApolloClient<any>;
  private capitalizedModelName: string;
  private capitalizedModelNamePlural: string;
  private customQueries: ICustomQueries;
  private customMutations: ICustomMutations;
  private modelName: string;
  private modelNamePlural: string;
  private searchable: boolean;

  constructor(model: typeof Model, options?: IGraphQLApiAdapterOptions) {
    this.client = (options != null && options.client) || GraphQLApiAdapter.defaultClient;
    this.capitalizedModelName = _.upperFirst(model.modelName);
    this.capitalizedModelNamePlural = pluralize(this.capitalizedModelName);
    this.customQueries = (options != null && options.customQueries) || null;
    this.customMutations = (options != null && options.customMutations) || null;
    this.modelName = _.lowerFirst(this.capitalizedModelName);
    this.modelNamePlural = _.lowerFirst(this.capitalizedModelNamePlural);
    this.modelFragment = (options != null && options.modelFragment) || this.buildGraphQLFragment(model);
    this.searchable = model.searchable;
  }

  public list = (options?: IApiRequestOptions, variables?: any, query?: any): Promise<IBackendModel[]> => {
    return this.query({
      query: query || this.listQuery(),
      variables,
    }, options).then((response: any) => {
      return response.data[this.modelNamePlural];
    });
  }

  public search = (searchTerm: string, options?: IApiRequestOptions): Promise<IBackendModel[]> => {
    let query;
    if (this.customQueries != null && this.customQueries.search != null) {
      query = this.customQueries.search;
    }

    return this.list(options, { searchTerm }, query);
  }

  public get = (id: string, options?: IApiRequestOptions): Promise<IBackendModel> => {
    return this.query({
      query: this.getQuery(),
      variables: {
        id,
      },
    }, options).then((response: any) => {
      return response.data[this.modelName];
    });
  }

  public create = (payload: NewModel, options?: IApiRequestOptions): Promise<IBackendModel> => {
    return this.mutateAction("create", payload, options);
  }

  public update = (payload: PartialModel, options?: IApiRequestOptions): Promise<IBackendModel> => {
    return this.mutateAction("update", payload, options);
  }

  public upsert = (payload: NewModel | PartialModel, options?: IApiRequestOptions): Promise<IBackendModel> => {
    return this.mutateAction("upsert", payload, options);
  }

  public delete = (id: string, options?: IApiRequestOptions): Promise<IBackendModel> => {
    return this.mutate({
      mutation: this.deleteMutation(),
      variables: {
        id,
      },
    }, options).then((response: any) => {
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

  private requestOptionsToGraphQLOptions(
    requestOptions?: IApiRequestOptions,
  ): Partial<QueryOptions> | Partial<MutationOptions> {
    if (requestOptions == null) {
      return {};
    }

    const additionalOptions: Partial<QueryOptions> | Partial<MutationOptions> = {};

    if (requestOptions.noCache) {
      additionalOptions.fetchPolicy = "no-cache";
    }

    return additionalOptions;
  }

  private query = (queryOptions: QueryOptions, requestOptions?: IApiRequestOptions) => {
    return this.client.query({
      ...queryOptions,
      ...this.requestOptionsToGraphQLOptions(requestOptions),
    });
  }

  private mutateAction = (
    action: string,
    payload: NewModel | PartialModel,
    options?: IApiRequestOptions,
  ): Promise<IBackendModel> => {
    return this.mutate({
      mutation: this.mutation(action),
      variables: {
        input: payload,
      },
    }, options).then((response: any) => {
      return response.data[`${action}${this.capitalizedModelName}`][this.modelName];
    });
  }

  private mutate = (mutationOptions: MutationOptions, requestOptions?: IApiRequestOptions) => {
    return this.client.mutate({
      ...mutationOptions,
      ...this.requestOptionsToGraphQLOptions(requestOptions),
    });
  }

  private getQuery = () => {
    if (this.customQueries != null && this.customQueries.get != null) {
      return this.customQueries.get;
    }

    return gql`
      query Get${this.capitalizedModelName}($id: ID!) {
        ${this.modelName}(id: $id) {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
  }

  private listQuery = () => {
    if (this.customQueries != null && this.customQueries.list != null) {
      return this.customQueries.list;
    }

    const searchVariables = this.searchable ? "($searchTerm: String)" : "";
    const searchArguments = this.searchable ? "(searchTerm: $searchTerm)" : "";

    return gql`
      query List${this.capitalizedModelNamePlural}${searchVariables} {
        ${this.modelNamePlural}${searchArguments} {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
  }

  private mutation = (action: string) => {
    if (this.customMutations != null && this.customMutations[action] != null) {
      return this.customMutations[action];
    }

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
    if (this.customMutations != null && this.customMutations.delete != null) {
      return this.customMutations.delete;
    }

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
