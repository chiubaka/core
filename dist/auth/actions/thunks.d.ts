import { IAuthState } from "../model";
export declare function completeLogoutAndRedirect(): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("./types").AuthAction>, _getState: () => IAuthState) => void;
