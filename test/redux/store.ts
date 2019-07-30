import { applyMiddleware, combineReducers, createStore } from "redux";
import configureStore from "redux-mock-store";
import { FlushThunks } from "redux-testkit";
import thunk, { ThunkDispatch } from "redux-thunk";

import { ormReducer } from "../../src";

import { orm } from "../models";

export const flushThunks = FlushThunks.createMiddleware();

type DispatchExts = ThunkDispatch<any, void, any>;

const middlewares = [flushThunks, thunk];
const mockStore = configureStore<any, DispatchExts>(middlewares);
export const store = mockStore({
  auth: {
    token: "foobar",
  },
});

export const fullStore = createStore<any, any, DispatchExts, any>(
  combineReducers({
    orm: ormReducer(orm),
  }),
  applyMiddleware(...middlewares),
);
