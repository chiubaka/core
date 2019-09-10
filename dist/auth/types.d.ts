import { IUser } from "./model";
export interface ISocialLoginProvider {
    providerName: string;
    clientId: string;
}
export interface IJwtResponse {
    token: string;
}
export interface IJwtUserResponse extends IUser, IJwtResponse {
}
