import fetchMock from "fetch-mock";
import _ from "lodash";

import { assertLastCallPath, assertLogoutAndRedirect, store } from "../../../../test";

import { IJwtUserResponse, IUser } from "../../../app";
import { ActionTypes } from "../types";
import { AuthRestApiAdapter } from "./adapters";
import { IGraphQLSocialAuthResponse } from "./adapters/GraphQLApiAdapter";
import { AuthApi } from "./AuthApi";

const MOCK_TOKEN = "faketoken";
const USER_DETAILS: IUser = {
  id: "1",
  firstName: "Daniel",
  lastName: "Chiu",
  email: "daniel@chiubaka.com",
};

// For some reason without this line, mocking calls to /graphql/ fails. It's not totally
// clear why, since the postOnce mock is getting properly triggered, but only when this
// line is here. Putting it elsewhere, e.g. in beforeAll() also does not seem to work.
fetchMock.catch();

describe("AuthApi", () => {
  afterEach(() => {
    store.clearActions();
    fetchMock.reset();
  });

  const testLogin = (api: AuthApi) => {
    return store.dispatch(api.login("test", "test"));
  };

  const testSocialLogin = (api: AuthApi) => {
    return store.dispatch(api.socialLogin("facebook", "foobar", "https://foo.bar"));
  };

  const testSocialLoginAccessToken = (api: AuthApi) => {
    return store.dispatch(api.socialLoginAccessToken("facebook", "foobar"));
  };

  const testLogout = (api: AuthApi) => {
    return store.dispatch(api.logout());
  };

  describe("with GraphQLApiAdapter", () => {
    const api = new AuthApi();

    describe("#login", () => {
      it("throws an unimplemented error", async () => {
        expect(() => testLogin(api)).toThrow();
      });

      xit("logs the user in", async () => {
        await testLogin(api);
        assertSuccessfulLoginActions();
      });
    });

    describe("#socialLogin", () => {
      it("throws an unimplemented error", async () => {
        expect(() => testSocialLogin(api)).toThrow();
      });

      xit("logs the user in", async () => {
        await testSocialLogin(api);
        assertSuccessfulLoginActions();
      });
    });

    describe("#socialLoginAccessToken", () => {
      const testSocialLoginAccessTokenGraphQL = () => {
        const payload: IGraphQLSocialAuthResponse = {
          data: {
            socialAuth: {
              __typename: "SocialAuth",
              social: {
                __typename: "Social",
                uid: "1",
                extraData: {},
                user: {
                  __typename: "User",
                  id: "1",
                  createdAt: "2019-08-28T16:24:57.355125+00:00",
                },
              },
              token: MOCK_TOKEN,
            },
          },
        };

        fetchMock.postOnce("path:/graphql/", payload);
        return testSocialLoginAccessToken(api);
      };

      it("logs the user in", async () => {
        await testSocialLoginAccessTokenGraphQL();
        assertSuccessfulLoginActions();
      });

      it("fires a POST call to the GraphQL endpoint", async () => {
        await testSocialLoginAccessTokenGraphQL();
        assertLastCallPath("/graphql/");
      });
    });

    describe("#logout", () => {
      it("logs the user out and redirects", async () => {
        await testLogout(api);
        assertLogoutAndRedirect(store.getActions());
      });
    });
  });

  describe("with RestApiAdapter", () => {
    const api = new AuthApi(AuthRestApiAdapter.getInstance());

    describe("#login", () => {
      describe("when response includes user details", () => {
        it("logs the user in", async () => {
          fetchMock.postOnce("path:/api/login/username/jwt/", {
            ...USER_DETAILS,
            token: MOCK_TOKEN,
          });

          await testLogin(api);
          assertSuccessfulLoginActions();
        });
      });

      describe("when response does not include user details", () => {
        it("logs the user in and retrieves the details", async () => {
          fetchMock.postOnce("path:/api/login/username/jwt/", {
            token: MOCK_TOKEN,
          });
          fetchMock.getOnce("path:/api/users/me/", USER_DETAILS);

          await testLogin(api);
          assertSuccessfulLoginActions();
        });
      });
    });

    describe("#socialLogin", () => {
      it("logs the user in", async () => {
        const payload: IJwtUserResponse = {
          ...USER_DETAILS,
          token: MOCK_TOKEN,
        };
        fetchMock.postOnce("path:/api/login/social/jwt_user/", payload);
        await testSocialLogin(api);
        assertSuccessfulLoginActions();
      });
    });

    describe("#socialLoginAccessToken", () => {
      it("throws an unimplemented error", async () => {
        expect(() => testSocialLoginAccessToken(api)).toThrow();
      });

      xit("logs the user in", async () => {
        await testSocialLoginAccessToken(api);
        assertSuccessfulLoginActions();
      });
    });

    describe("#logout", () => {
      it("logs the user out and redirects", async () => {
        fetchMock.deleteOnce("path:/api/logout/jwt/", {});
        await testLogout(api);
        assertLogoutAndRedirect(store.getActions());
      });
    });
  });
});

function assertSuccessfulLoginActions() {
  const actions = store.getActions();
  expect(actions.length).toEqual(3);
  const actionTypes = new Set(actions.map((action) => action.type));
  const expectedTypes = new Set([
    ActionTypes.START_LOGIN,
    ActionTypes.SUCCESSFUL_GET_USER_DETAILS,
    ActionTypes.COMPLETE_LOGIN,
  ]);

  expect(_.isEqual(actionTypes, expectedTypes)).toBe(true);

  const completeLogin = actions.find((action) => action.type === ActionTypes.COMPLETE_LOGIN);
  expect(completeLogin.token).toEqual(MOCK_TOKEN);
}
