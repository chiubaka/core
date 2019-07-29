import configureStore from "redux-mock-store";
import { FlushThunks } from "redux-testkit";
import thunk, { ThunkDispatch } from "redux-thunk";

export const flushThunks = FlushThunks.createMiddleware();

type DispatchExts = ThunkDispatch<any, void, any>;

const middlewares = [flushThunks, thunk];
const mockStore = configureStore<any, DispatchExts>(middlewares);
export const store = mockStore({
  auth: {
    token: "foobar",
  },
});
