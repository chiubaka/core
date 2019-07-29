import fetchMock from "fetch-mock";

import { assertLastCallPath, assertLogoutAndRedirect, store } from "../../../../test";

import { ActionTypes } from "../types";
import { IGraphQLSocialAuthResponse } from "./adapters/GraphQLApiAdapter";
import { AuthApi } from "./AuthApi";

const MOCK_TOKEN = "faketoken";

// For some reason without this line, mocking calls to /graphql/ fails. It's not totally
// clear why, since the postOnce mock is getting properly triggered, but only when this
// line is here. Putting it elsewhere, e.g. in beforeAll() also does not seem to work.
fetchMock.catch();

describe("AuthApi", () => {
  afterEach(() => {
    store.clearActions();
    fetchMock.reset();
  });

  describe("with GraphQLApiAdapter", () => {
    const api = new AuthApi();

    const testLogin = () => {
      return store.dispatch(api.login("test", "test"));
    };

    const testSocialLogin = () => {
      return store.dispatch(api.socialLogin("facebook", "foobar", "https://foo.bar"));
    };

    const testSocialLoginAccessToken = () => {
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
              },
            },
            token: MOCK_TOKEN,
          },
        },
      };

      fetchMock.postOnce("path:/graphql/", payload);
      return store.dispatch(api.socialLoginAccessToken("facebook", "foobar"));
    };

    const testLogout = () => {
      return store.dispatch(api.logout());
    };

    describe("#login", () => {
      it("throws an unimplemented error", async () => {
        expect(testLogin).toThrow();
      });

      xit("dispatches a START_LOGIN action", async () => {
        await testLogin();
        assertSuccessfulLoginActions();
      });
    });

    describe("#socialLogin", () => {
      it("throws an unimplemented error", async () => {
        expect(testSocialLogin).toThrow();
      });

      xit("dispatches a START_LOGIN action", async () => {
        await testSocialLogin();
        assertSuccessfulLoginActions();
      });
    });

    describe("#socialLoginAccessToken", () => {
      it("dispatches a START_LOGIN action", async () => {
        await testSocialLoginAccessToken();
        assertSuccessfulLoginActions();
      });

      it("fires a POST call to the GraphQL endpoint", async () => {
        await testSocialLoginAccessToken();
        assertLastCallPath("/graphql/");
      });
    });

    describe("#logout", () => {
      it("dispatches a logout and redirect", async () => {
        await testLogout();
        assertLogoutAndRedirect(store.getActions());
      });
    });
  });
});

function assertSuccessfulLoginActions() {
  const actions = store.getActions();
  expect(actions.length).toEqual(3);

  const startLogin = actions[0];
  expect(startLogin.type).toEqual(ActionTypes.START_LOGIN);

  const successfulGetUserDetails = actions[1];
  expect(successfulGetUserDetails.type).toEqual(ActionTypes.SUCCESSFUL_GET_USER_DETAILS);

  const completeLogin = actions[2];
  expect(completeLogin.type).toEqual(ActionTypes.COMPLETE_LOGIN);
  expect(completeLogin.token).toEqual(MOCK_TOKEN);
}
