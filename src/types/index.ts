export interface IProductProps extends IServiceProps {
  logo: string;
  productName: string;
  testMarketingMode: boolean;
}

export interface IServiceProps {
  hostname: string;
  port?: number;
  useSsl?: boolean;
}

export interface IOAuth2Props extends IServiceProps {
  oAuth2CallbackBasePath?: string;
}

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

// TODO: This response object only exists because the Python server returns names in snake case.
// Ideally, remove this and get server to respond in camel case.
export interface IUserResponse extends IUserBase {
  first_name: string;
  last_name: string;
}

export interface IUser extends IUserBase {
  firstName: string;
  lastName: string;
}
