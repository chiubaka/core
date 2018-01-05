export interface ISocialLoginProvider {
  providerName: string;
  clientId: string;
}

export interface IUserBase {
  id: number;
  token: string;
  username: string;
  email: string;
}

export interface IUserResponse extends IUserBase {
  first_name: string;
  last_name: string;
}

export interface IUser extends IUserBase {
  firstName: string;
  lastName: string;
}
