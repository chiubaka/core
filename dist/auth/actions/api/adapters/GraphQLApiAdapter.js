"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_boost_1 = __importStar(require("apollo-boost"));
const creators_1 = require("../../creators");
class GraphQLApiAdapter {
    constructor(client = new apollo_boost_1.default({ uri: "/graphql/" })) {
        this.socialLoginAccessToken = (provider, accessToken, dispatch, _authState) => {
            return this.client.mutate({
                mutation: apollo_boost_1.gql `
        mutation {
          socialAuth(provider: "${provider}", accessToken: "${accessToken}") {
            social {
              uid
              extraData
              user {
                id
              }
            }
            token
          }
        }
      `,
            }).then((response) => {
                const jwtToken = GraphQLApiAdapter.jwtTokenFromSocialAuthResponse(response);
                if (jwtToken == null) {
                    return Promise.reject("An error occurred during the authentication process.");
                }
                dispatch(creators_1.successfulGetUserDetails(GraphQLApiAdapter.userFromSocialAuthResponse(response)));
                dispatch(creators_1.completeLogin(response.data.socialAuth.token));
            });
        };
        this.logout = (_dispatch, _authState) => {
            // TODO: GraphQL JWT needs to have a standard way to blacklist live tokens
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
    static jwtTokenFromSocialAuthResponse(response) {
        if (response.data == null || response.data.socialAuth == null || response.data.socialAuth.token == null) {
            return null;
        }
        return response.data.socialAuth.token;
    }
    static userFromSocialAuthResponse(response) {
        if (response.data == null || response.data.socialAuth == null || response.data.socialAuth.social == null) {
            return null;
        }
        const social = response.data.socialAuth.social;
        return {
            id: social.user.id,
            email: social.extraData.email,
            firstName: social.extraData.firstName,
            lastName: social.extraData.lastName,
            extraData: {
                picture: social.extraData.picture,
            },
        };
    }
}
exports.GraphQLApiAdapter = GraphQLApiAdapter;
//# sourceMappingURL=GraphQLApiAdapter.js.map