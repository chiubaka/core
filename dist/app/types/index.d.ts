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
export interface IJwtUserResponse extends IUser, IJwtResponse {
}
