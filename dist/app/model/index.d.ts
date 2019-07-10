export * from "./Model";
export * from "./types";
export declare function generateId(): string;
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
    useSsl: boolean;
}
