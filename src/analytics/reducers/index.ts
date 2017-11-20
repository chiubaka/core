import { AnalyticsInnerState, DEFAULT_ANALYTICS_STATE } from "../model/AnalyticsState";
import { Action } from "redux";

export function analytics(state: AnalyticsInnerState = DEFAULT_ANALYTICS_STATE, action: Action) {
  return state;
}