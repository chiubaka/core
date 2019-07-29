import { IModel } from "../../api";

export interface IUserBase extends IModel {
  username?: string;
  email: string;
}

export interface IUser<TExtraData = any> extends IUserBase {
  firstName: string;
  lastName: string;
  extraData?: TExtraData;
}

export interface IJwtResponse {
  token: string;
}

// TODO: This response object only exists because the Python server returns names in snake case.
// Ideally, remove this and get server to respond in camel case.
export interface IJwtUserResponse extends IUser, IJwtResponse {}
