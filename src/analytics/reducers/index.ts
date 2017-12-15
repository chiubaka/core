import { Action } from "redux";
import { AnalyticsInnerState, DEFAULT_ANALYTICS_STATE } from "../model/AnalyticsState";

export function analytics(state: AnalyticsInnerState = DEFAULT_ANALYTICS_STATE, action: Action) {
  return state;
}
