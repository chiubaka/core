import { IModel } from "../../api";

export interface IUserBase extends IModel {
  username: string;
  email: string;
}

export interface IUser extends IUserBase {
  firstName: string;
  lastName: string;
}

export interface IJwtResponse {
  token: string;
}

// TODO: This response object only exists because the Python server returns names in snake case.
// Ideally, remove this and get server to respond in camel case.
export interface IJwtUserResponse extends IUser, IJwtResponse {}
