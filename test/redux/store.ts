import configureStore from "redux-mock-store";
import { FlushThunks } from "redux-testkit";
import thunk from "redux-thunk";

export const flushThunks = FlushThunks.createMiddleware();

const middlewares = [flushThunks, thunk];
const mockStore = configureStore(middlewares);
export const store = mockStore({
  auth: {
    token: "foobar",
  },
});
