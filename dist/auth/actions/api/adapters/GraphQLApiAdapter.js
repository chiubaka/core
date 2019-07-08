"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_boost_1 = require("apollo-boost");
class GraphQLApiAdapter {
    constructor(client = new apollo_boost_1.default()) {
        this.socialLoginAccessToken = (provider, token, dispatch, authState) => {
            return this.client.mutate({
                mutation: apollo_boost_1.gql `
        mutation {
          socialAuth(provider: "${provider}", accessToken: "${token}") {
            social {
              uid
            }
            token
          }
        }
      `,
            }).then((response) => {
                console.log(response);
            });
        };
        this.logout = () => {
            console.error("Logout is not yet implemented on GraphQLApiAdapter for AuthApi");
            return Promise.resolve();
        };
        this.client = client;
    }
    static getInstance() {
        if (!GraphQLApiAdapter.singleton) {
            GraphQLApiAdapter.singleton = new GraphQLApiAdapter();
        }
        return GraphQLApiAdapter.singleton;
    }
}
exports.GraphQLApiAdapter = GraphQLApiAdapter;

//# sourceMappingURL=../../../../dist/auth/actions/api/adapters/GraphQLApiAdapter.js.map
