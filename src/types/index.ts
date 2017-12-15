export interface ProductProps extends ServiceProps {
  logo: string;
  productName: string;
  testMarketingMode: boolean;
}

export interface ServiceProps {
  hostname: string;
  port?: number;
  useSsl?: boolean;
}

export interface OAuth2Props extends ServiceProps {
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
