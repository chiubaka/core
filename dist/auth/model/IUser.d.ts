import { IModel } from "../../app";
export interface IUserBase extends IModel {
    username: string;
    email: string;
}
export interface IUser extends IUserBase {
    firstName: string;
    lastName: string;
}
