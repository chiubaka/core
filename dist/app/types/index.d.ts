import { IModel } from "../model";
export interface ISocialLoginProvider {
    providerName: string;
    clientId: string;
}
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
export interface IJwtUserResponse extends IUser, IJwtResponse {
}
