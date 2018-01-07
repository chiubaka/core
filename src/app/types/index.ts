export interface ISocialLoginProvider {
  providerName: string;
  clientId: string;
}

export interface IUserBase {
  id: number;
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
export interface IJwtUserResponse extends IUserBase, IJwtResponse {
  first_name: string;
  last_name: string;
}
