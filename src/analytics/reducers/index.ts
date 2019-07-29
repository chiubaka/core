import { Action } from "redux";
import { DEFAULT_ANALYTICS_STATE, IAnalyticsInnerState } from "../model/AnalyticsState";

export function analytics(state: IAnalyticsInnerState = DEFAULT_ANALYTICS_STATE, _action: Action) {
  return state;
}
