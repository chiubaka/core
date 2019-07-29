import fetchMock, { MockResponse } from "fetch-mock";
import * as HttpStatus from "http-status-codes";

import { assertLogoutAndRedirect, store } from "../../../test";

import { Api } from "../actions/Api";
import { RestClient } from "./RestClient";

describe("RestClient", () => {
  afterEach(() => {
    store.clearActions();
    fetchMock.reset();
  });

  describe("#getInstance", () => {
    it("correctly returns a singleton", () => {
      expect(RestClient.getInstance()).toBe(RestClient.getInstance());
    });
  });

  describe("#encodeUrlParams", () => {
    it("correctly encodes URL params", () => {
      expect(RestClient.encodeUrlParams({
        foo: "a very cool parameter",
        bar: "derp",
      })).toEqual("foo=a%20very%20cool%20parameter&bar=derp");
    });
  });

  describe("#getRequest", () => {
    it("makes a GET fetch request to the correct path", () => {
      testGet();
      expect(fetchMock.calls().length).toEqual(1);
    });

    it("includes the appropriate headers with fetch requests", () => {
      testGet();
      const headers = getHeaders(fetchMock.lastCall());
      headers.get("Authorization");
      expect(headers.get("Authorization")).toEqual("Bearer foobar");
      expect(headers.get("Content-Type")).toEqual("application/json");
    });

    it("fulfills a Promise containing the response JSON on OK", async () => {
      await testPromiseResolution(new Response(JSON.stringify(["test"]), { status: HttpStatus.OK }), ["test"]);
    });

    it("fulfills a Promise containing the response JSON on CREATED", async () => {
      await testPromiseResolution(new Response(JSON.stringify(["test"]), { status: HttpStatus.CREATED }), ["test"]);
    });

    it("triggers a logout and redirect action when response is unauthorized", async () => {
      await testPromiseRejection(HttpStatus.UNAUTHORIZED, "You are not logged in.");
      const actions = store.getActions();

      assertLogoutAndRedirect(actions);

      const unsuccessfulApiRequest = actions[2];
      expect(unsuccessfulApiRequest.type).toEqual(Api.UNSUCCESSFUL_API_REQUEST_TYPE);
    });

    it("fulfills a Promise with no content on NO_CONTENT", async () => {
      await testPromiseResolution(HttpStatus.NO_CONTENT, null);
    });

    it("rejects a Promise on FORBIDDEN", async () => {
      await testPromiseRejection(HttpStatus.FORBIDDEN);
    });

    it("rejects a Promise on BAD_REQUEST and uses the errorTransformer to construct a message", async () => {
      const error = {
        foo: ["Unexpected value"],
      };

      const response = new Response(
        JSON.stringify(error),
        { status: HttpStatus.BAD_REQUEST },
      );

      await testPromiseRejection(response, "Unexpected value");
    });

    it("rejects a Promise on INTERNAL_SERVER_ERROR", async () => {
      await testPromiseRejection(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it("rejects a Promise on GATEWAY_TIMEOUT", async () => {
      await testPromiseRejection(HttpStatus.GATEWAY_TIMEOUT);
    });

    it("rejects a Promise when an unexpected status code is received", async () => {
      await testPromiseRejection(
        HttpStatus.FAILED_DEPENDENCY,
        `Received unexpected status code ${HttpStatus.FAILED_DEPENDENCY}`,
      );
    });
  });
});

function testGet(response: any = { foo: "bar" }) {
  fetchMock.getOnce("path:/test", response);

  const client = RestClient.getInstance();
  return client.getRequest("test", {}, store.dispatch, "foobar");
}

const HEADERS_KEY = "headers";
function getHeaders(fetchCall: any): any {
  return fetchCall[1][HEADERS_KEY];
}

async function testPromiseRejection(response: MockResponse, error?: string) {
  const promise = testGet(response);
  if (error != null) {
    await expect(promise).rejects.toEqual(error);
  } else {
    await expect(promise).rejects.toBeDefined();
  }
}

async function testPromiseResolution(response: MockResponse, payload?: any) {
  const promise = testGet(response);
  if (payload != null) {
    await expect(promise).resolves.toEqual(payload);
  } else {
    await expect(promise).resolves.toBeDefined();
  }
}
