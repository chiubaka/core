import ApolloClient from "apollo-boost";
import { IBackendModel, Model, NewModel, PartialModel } from "../../model";
import { IModelApiAdapter } from "./types";
export declare class GraphQLApiAdapter implements IModelApiAdapter {
    static GRAPHQL_PATH: string;
    private client;
    private capitalizedModelName;
    private capitalizedModelNamePlural;
    private modelFragment;
    private modelName;
    private modelNamePlural;
    constructor(model: typeof Model, client?: ApolloClient<any>);
    list: () => Promise<IBackendModel[]>;
    get: (id: string) => Promise<IBackendModel>;
    create: (payload: NewModel<import("../../model").IModel>) => Promise<IBackendModel>;
    update: (payload: PartialModel<import("../../model").IModel>) => Promise<IBackendModel>;
    upsert: (payload: PartialModel<import("../../model").IModel> | NewModel<import("../../model").IModel>) => Promise<IBackendModel>;
    delete: (id: string) => Promise<IBackendModel>;
    private buildGraphQLFragment;
    private mutate;
    private getQuery;
    private listQuery;
    private mutation;
    private deleteMutation;
}
