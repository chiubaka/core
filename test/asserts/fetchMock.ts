import fetchMock, { MockCall } from "fetch-mock";

export function assertLastCallPath(expected: string) {
  assertCallPath(fetchMock.lastCall(), expected);
}

export function assertCallPath(call: MockCall, expected: string) {
  expect(call[0]).toEqual(expected);
}
