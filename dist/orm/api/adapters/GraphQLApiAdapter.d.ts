import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { IBackendModel, Model, NewModel, PartialModel } from "../../model";
import { IApiRequestOptions } from "../types";
import { IModelApiAdapter } from "./types";
interface ICustomQueries {
    list?: any;
    search?: any;
    get?: any;
}
interface ICustomMutations {
    [action: string]: any;
    create?: any;
    update?: any;
    upsert?: any;
    delete?: any;
}
interface IGraphQLApiAdapterOptions {
    client?: ApolloClient<any>;
    modelFragment?: any;
    customQueries?: ICustomQueries;
    customMutations?: ICustomMutations;
}
export declare class GraphQLApiAdapter implements IModelApiAdapter {
    static GRAPHQL_PATH: string;
    static readonly sharedClient: ApolloClient<any>;
    static readonly sharedClientOptions: ApolloClientOptions<any>;
    static setClientOptions(options: Partial<ApolloClientOptions<any>>): void;
    private static readonly defaultClientOptions;
    private static _defaultClientOptions;
    private static _sharedClientOptions;
    private static _sharedClient;
    readonly modelFragment: string;
    private capitalizedModelName;
    private capitalizedModelNamePlural;
    private customQueries;
    private customMutations;
    private modelName;
    private modelNamePlural;
    private searchable;
    constructor(model: typeof Model, options?: IGraphQLApiAdapterOptions);
    list: (options?: IApiRequestOptions, variables?: any, query?: any) => Promise<IBackendModel[]>;
    search: (searchTerm: string, options?: IApiRequestOptions) => Promise<IBackendModel[]>;
    get: (id: string, options?: IApiRequestOptions) => Promise<IBackendModel>;
    create: (payload: NewModel<import("../../model").IModel>, options?: IApiRequestOptions) => Promise<IBackendModel>;
    update: (payload: PartialModel<import("../../model").IModel>, options?: IApiRequestOptions) => Promise<IBackendModel>;
    upsert: (payload: PartialModel<import("../../model").IModel> | NewModel<import("../../model").IModel>, options?: IApiRequestOptions) => Promise<IBackendModel>;
    delete: (id: string, options?: IApiRequestOptions) => Promise<IBackendModel>;
    private buildGraphQLFragment;
    private requestOptionsToGraphQLOptions;
    private query;
    private mutateAction;
    private mutate;
    private getQuery;
    private listQuery;
    private mutation;
    private deleteMutation;
}
export {};
