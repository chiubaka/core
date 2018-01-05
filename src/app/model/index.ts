export interface IProductState {
  product: IProductInnerState;
}

export interface IProductInnerState {
  logoPath?: string;
  productName: string;
  testMarketingMode: boolean;
}

export interface IServiceState {
  service: IServiceInnerState;
}

export interface IServiceInnerState {
  hostname: string;
  port?: number;
  // TODO: This could eventually be optional. Should default to true.
  useSsl: boolean;
}
