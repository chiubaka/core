import { ActionTypes } from "../../src";

export function assertLogoutAndRedirect(actions: any[]) {
  const completeLogout = actions[0];
  expect(completeLogout.type).toEqual(ActionTypes.COMPLETE_LOGOUT);

  const redirect = actions[1];
  expect(redirect.type).toEqual("@@router/CALL_HISTORY_METHOD");
  expect(redirect.payload.args[0]).toEqual("/auth/login");
}
