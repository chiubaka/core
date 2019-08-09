import { Action, applyMiddleware, combineReducers, createStore } from "redux";
import configureStore from "redux-mock-store";
import { FlushThunks } from "redux-testkit";
import thunk, { ThunkMiddleware } from "redux-thunk";

import { Dispatch, ormReducer } from "../../src";

import { orm } from "../models";

export const flushThunks = FlushThunks.createMiddleware();

const middlewares = [flushThunks, thunk as ThunkMiddleware<any, Action>];
const mockStore = configureStore<any, Dispatch>(middlewares);
export const store = mockStore({
  auth: {
    token: "foobar",
  },
});

export const fullStore = createStore<any, Action, Dispatch, any>(
  combineReducers({
    orm: ormReducer(orm),
  }),
  applyMiddleware(...middlewares),
);
