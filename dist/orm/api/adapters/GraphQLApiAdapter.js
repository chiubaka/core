"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_boost_1 = __importStar(require("apollo-boost"));
const lodash_1 = __importDefault(require("lodash"));
const pluralize_1 = __importDefault(require("pluralize"));
const model_1 = require("../../model");
class GraphQLApiAdapter {
    constructor(model, client = new apollo_boost_1.default({ uri: GraphQLApiAdapter.GRAPHQL_PATH })) {
        this.list = () => {
            return this.client.query({
                query: this.listQuery(),
            }).then((response) => {
                return response.data[this.modelNamePlural];
            });
        };
        this.get = (id) => {
            return this.client.query({
                query: this.getQuery(),
                variables: {
                    id,
                },
            }).then((response) => {
                return response.data[this.modelName];
            });
        };
        this.create = (payload) => {
            return this.mutate("create", payload);
        };
        this.update = (payload) => {
            return this.mutate("update", payload);
        };
        this.upsert = (payload) => {
            return this.mutate("upsert", payload);
        };
        this.delete = (id) => {
            return this.client.mutate({
                mutation: this.deleteMutation(),
                variables: {
                    id,
                },
            }).then((response) => {
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
      fragment ${this.capitalizedModelName}Fragment on ${this.modelName} {
        ${fields}
      }
    `;
        };
        this.mutate = (action, payload) => {
            return this.client.mutate({
                mutation: this.mutation(action),
                variables: {
                    input: payload,
                },
            }).then((response) => {
                return response.data[`${action}${this.capitalizedModelName}`][this.modelName];
            });
        };
        this.getQuery = () => {
            return apollo_boost_1.gql `
      query Get${this.capitalizedModelName}($id: String!) {
        get${this.capitalizedModelName}(id: $id) {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
        };
        this.listQuery = () => {
            return apollo_boost_1.gql `
      query list${this.capitalizedModelNamePlural} {
        ${this.modelNamePlural} {
          ...${this.capitalizedModelName}Fragment
        }
      }
      ${this.modelFragment}
    `;
        };
        this.mutation = (action) => {
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
            return apollo_boost_1.gql `
      mutation Delete${this.capitalizedModelName}(id: String!) {
        delete${this.capitalizedModelName}(id: $id) {
          ${this.modelName} {
            ...${this.capitalizedModelName}Fragment
          }
        }
      }
    `;
        };
        this.client = client;
        this.capitalizedModelName = lodash_1.default.upperFirst(model.modelName);
        this.capitalizedModelNamePlural = pluralize_1.default(this.capitalizedModelName);
        this.modelName = lodash_1.default.lowerFirst(this.capitalizedModelName);
        this.modelNamePlural = lodash_1.default.lowerFirst(this.capitalizedModelNamePlural);
        this.modelFragment = this.buildGraphQLFragment(model);
    }
}
GraphQLApiAdapter.GRAPHQL_PATH = "/graphql/";
exports.GraphQLApiAdapter = GraphQLApiAdapter;
//# sourceMappingURL=GraphQLApiAdapter.js.map