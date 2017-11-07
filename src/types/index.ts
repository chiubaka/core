export interface ProductProps {
  logo: string;
  productName: string;
  hostname: string;
  port?: number;
}

export interface OAuth2Props {
  hostname: string;
  oAuth2CallbackBasePath?: string;
  useSsl?: boolean;
  port?: number;
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