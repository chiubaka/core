import { IModel } from "../../orm";

export interface IUserBase extends IModel {
  username: string;
  email: string;
}

export interface IUser extends IUserBase {
  firstName: string;
  lastName: string;
}
