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

export interface IUser {
  username: string;
  email: string;
  token: string;
}
