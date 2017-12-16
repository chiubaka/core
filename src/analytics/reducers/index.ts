import { Action } from "redux";
import { IAnalyticsInnerState, DEFAULT_ANALYTICS_STATE } from "../model/AnalyticsState";

export function analytics(state: IAnalyticsInnerState = DEFAULT_ANALYTICS_STATE, action: Action) {
  return state;
}
