import fetchMock, { MockCall } from "fetch-mock";
import { GraphQLApiAdapter } from "../../src/orm/api/adapters/GraphQLApiAdapter";

export function assertGraphQLCall() {
  expect(fetchMock.calls().length).toEqual(1);
  assertLastCallPath(GraphQLApiAdapter.GRAPHQL_PATH);
}

export function assertLastCallPath(expected: string) {
  assertCallPath(fetchMock.lastCall(), expected);
}

export function assertCallPath(call: MockCall, expected: string) {
  expect(call[0]).toEqual(expected);
}
