export interface IProductState {
    product: IProductInnerState;
}
export interface IProductInnerState {
    logoPath?: string;
    productName: string;
    testMarketingMode: boolean;
}
