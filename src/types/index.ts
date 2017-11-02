export interface ProductProps {
  logo: string;
  productName: string;
  hostname: string;
  port?: number;
}

export interface ISocialLoginProvider {
  name: string;
  clientId: string;
}

export interface IUser {
  username: string;
  email: string;
  token: string;
}