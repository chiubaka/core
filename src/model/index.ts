export interface ProductState {
  product: ProductInnerState;
}

export interface ProductInnerState {
  logoPath: string;
  productName: string;
  testMarketingMode: boolean;
}

export interface ServiceState {
  service: ServiceInnerState;
}

export interface ServiceInnerState {
  hostname: string;
  port: number;
  useSsl: boolean;
}