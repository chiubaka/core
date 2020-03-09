"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_boost_1 = require("apollo-boost");
const apollo_client_1 = require("apollo-client");
const apollo_link_context_1 = require("apollo-link-context");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_link_ws_1 = require("apollo-link-ws");
const graphql_1 = require("graphql");
const lodash_1 = __importDefault(require("lodash"));
const pluralize_1 = __importDefault(require("pluralize"));
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const storage_1 = require("../../../auth/utils/storage");
const model_1 = require("../../model");
class GraphQLApiAdapter {
    constructor(model, options) {
        this.list = (options, variables, query) => {
            return this.query({
                query: query || this.listQuery(),
                variables,
            }, options).then((response) => {
                return response.data[this.modelNamePlural];
            });
        };
        this.search = (searchTerm, options) => {
            let query;
            if (this.customQueries != null && this.customQueries.search != null) {
                query = this.customQueries.search;
            }
            return this.list(options, { searchTerm }, query);
        };
        this.get = (id, options) => {
            return this.query({
                query: this.getQuery(),
                variables: {
                    id,
                },
            }, options).then((response) => {
                return response.data[this.modelName];
            });
        };
        this.create = (payload, options) => {
            return this.mutateAction("create", payload, options);
        };
        this.update = (payload, options) => {
            return this.mutateAction("update", payload, options);
        };
        this.upsert = (payload, options) => {
            return this.mutateAction("upsert", payload, options);
        };
        this.delete = (id, options) => {
            return this.mutate({
                mutation: this.deleteMutation(),
                variables: {
                    input: {
                        id,
                    },
                },
            }, options).then((response) => {
                return response.data[`delete${this.capitalizedModelName}`][this.modelName];
            });
        };
        this.buildGraphQLFragment = (model) => {
            const fields = Object.keys(model.fields).reduce((accumulator, fieldName) => {
                // Skip internal values
                if (model_1.Model.isLocalField(fieldName)) {
                    return accumulator;
                }
                return accumulator + `${fieldName}\n`;
            }, "");
            return apollo_boost_1.gql `
      fragment ${this.capitalizedModelName}Fragment on ${this.capitalizedModelName} {
        ${fields}
      }
    `;
        };
        this.query = (queryOptions, requestOptions) => {
            return GraphQLApiAdapter.sharedClient.query(Object.assign({}, queryOptions, this.requestOptionsToGraphQLOptions(requestOptions)));
        };
        this.mutateAction = (action, payload, options) => {
            return this.mutate({
                mutation: this.mutation(action),
                variables: {
                    input: payload,
                },
            }, options).then((response) => {
                return response.data[`${action}${this.capitalizedModelName}`][this.modelName];
            });
        };
        this.mutate = (mutationOptions, requestOptions) => {
            return GraphQLApiAdapter.sharedClient.mutate(Object.assign({}, mutationOptions, this.requestOptionsToGraphQLOptions(requestOptions)));
        };
        this.getQuery = () => {
            if (this.customQueries != null && this.customQueries.get != null) {
                return this.customQueries.get;
            }
            return apollo_boost_1.gql `
      query Get${this.capitalizedModelName}($id: ID!) {
        ${this.modelName}(id: $id) {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
        };
        this.listQuery = () => {
            if (this.customQueries != null && this.customQueries.list != null) {
                return this.customQueries.list;
            }
            const searchVariables = this.searchable ? "($searchTerm: String)" : "";
            const searchArguments = this.searchable ? "(searchTerm: $searchTerm)" : "";
            return apollo_boost_1.gql `
      query List${this.capitalizedModelNamePlural}${searchVariables} {
        ${this.modelNamePlural}${searchArguments} {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
        };
        this.mutation = (action) => {
            if (this.customMutations != null && this.customMutations[action] != null) {
                return this.customMutations[action];
            }
            const capitalizedAction = lodash_1.default.upperFirst(action);
            return apollo_boost_1.gql `
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
        };
        this.deleteMutation = () => {
            if (this.customMutations != null && this.customMutations.delete != null) {
                return this.customMutations.delete;
            }
            return apollo_boost_1.gql `
      mutation Delete${this.capitalizedModelName}($input: Delete${this.capitalizedModelName}Input!) {
        delete${this.capitalizedModelName}(input: $input) {
          id
        }
      }
    `;
        };
        this.capitalizedModelName = lodash_1.default.upperFirst(model.modelName);
        this.capitalizedModelNamePlural = pluralize_1.default(this.capitalizedModelName);
        this.customQueries = (options != null && options.customQueries) || null;
        this.customMutations = (options != null && options.customMutations) || null;
        this.modelName = lodash_1.default.lowerFirst(this.capitalizedModelName);
        this.modelNamePlural = lodash_1.default.lowerFirst(this.capitalizedModelNamePlural);
        this.modelFragment = (options != null && options.modelFragment) || this.buildGraphQLFragment(model);
        this.searchable = model.searchable;
    }
    static get sharedClient() {
        if (this._sharedClient == null) {
            this._sharedClient = new apollo_client_1.ApolloClient(this.sharedClientOptions);
        }
        return this._sharedClient;
    }
    static get sharedClientOptions() {
        if (this._sharedClientOptions == null) {
            this._sharedClientOptions = this.defaultClientOptions;
        }
        return this._sharedClientOptions;
    }
    static setClientOptions(options) {
        this._sharedClientOptions = Object.assign({}, this.sharedClientOptions, options);
        this._sharedClient = new apollo_client_1.ApolloClient(this.sharedClientOptions);
    }
    static get defaultClientOptions() {
        if (this._defaultClientOptions == null) {
            const httpLink = apollo_link_http_1.createHttpLink({
                uri: GraphQLApiAdapter.GRAPHQL_PATH,
            });
            const token = storage_1.getToken();
            const authLink = apollo_link_context_1.setContext((_unused, { headers }) => {
                return {
                    headers: Object.assign({}, headers, { Authorization: token != null ? `Bearer ${token}` : "" }),
                };
            });
            const subscriptionClient = new subscriptions_transport_ws_1.SubscriptionClient(`ws://${window.location.host}${this.GRAPHQL_PATH}`, {
                reconnect: true,
                connectionParams: {
                    authToken: token,
                },
            });
            const wsLink = new apollo_link_ws_1.WebSocketLink(subscriptionClient);
            // https://github.com/apollographql/subscriptions-transport-ws/issues/275#issuecomment-330294921
            const link = apollo_boost_1.ApolloLink.split((operation) => {
                const operationAST = graphql_1.getOperationAST(operation.query, operation.operationName);
                return !!operationAST && operationAST.operation === "subscription";
            }, wsLink, authLink.concat(httpLink));
            this._defaultClientOptions = {
                link,
                cache: new apollo_boost_1.InMemoryCache(),
            };
        }
        return this._defaultClientOptions;
    }
    requestOptionsToGraphQLOptions(requestOptions) {
        if (requestOptions == null) {
            return {};
        }
        const additionalOptions = {};
        if (requestOptions.noCache) {
            additionalOptions.fetchPolicy = "no-cache";
        }
        return additionalOptions;
    }
}
GraphQLApiAdapter.GRAPHQL_PATH = "/graphql/";
exports.GraphQLApiAdapter = GraphQLApiAdapter;
//# sourceMappingURL=GraphQLApiAdapter.js.map