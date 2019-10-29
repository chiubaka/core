import { Action } from "redux";
import { IModel } from "../../orm";
import { ModelApi, SearchableModelApi } from "../actions";
export declare type ModelFilterFunction<T> = (model: T) => boolean;
export declare type ModelEqualityFunction<T> = (model1: T, model2: T) => boolean;
export declare type GetObjectsReducer<StateType, ModelType> = (objects: ModelType[]) => StateType;
export declare type MergeObjectReducer<StateType, ModelType> = (state: StateType, object: ModelType, locator?: any) => StateType;
export declare type ObjectLocatorFunction<StateType, ModelType> = (state: StateType, object: ModelType) => any;
interface IModelApiReducerOptions<StateT, ModelT extends IModel> {
    Apis: Array<ModelApi<ModelT>>;
    initialState: StateT;
    onBulkObjectAdd: GetObjectsReducer<StateT, ModelT>;
    onObjectAdd: MergeObjectReducer<StateT, ModelT>;
    onObjectRemove: MergeObjectReducer<StateT, ModelT>;
    objectLocator?: ObjectLocatorFunction<StateT, ModelT>;
    modelFilter?: ModelFilterFunction<ModelT>;
    modelEquality?: ModelEqualityFunction<ModelT>;
}
interface IModelApiReducerByPropertyOptions<T extends IModel> extends IModelApiReducerSimpleOptions<T> {
    propertyName: keyof T;
}
interface IModelApiReducerSimpleOptions<T extends IModel> {
    Api: ModelApi<T>;
    modelFilter?: ModelFilterFunction<T>;
    modelEquality?: ModelEqualityFunction<T>;
}
interface ISearchableModelApiReducerOptions<T extends IModel> {
    Api: SearchableModelApi<T>;
}
export declare function modelApiReducer<StateT, ModelT extends IModel>(options: IModelApiReducerOptions<StateT, ModelT>): (state: StateT, action: Action<any>) => StateT;
export declare function modelApiById<T extends IModel>(options: IModelApiReducerSimpleOptions<T>): (state: {}, action: Action<any>) => {};
export declare function modelApiByUniqueProperty<T extends IModel>(options: IModelApiReducerByPropertyOptions<T>): (state: {}, action: Action<any>) => {};
export declare function modelApiByProperty<T extends IModel>(options: IModelApiReducerByPropertyOptions<T>): (state: {}, action: Action<any>) => {};
export declare function modelApiAsArray<T extends IModel>(options: IModelApiReducerSimpleOptions<T>): (state: T[], action: Action<any>) => T[];
export declare function searchableModelApiAsArray<ModelT extends IModel>(options: ISearchableModelApiReducerOptions<ModelT>): (state: ModelT[], action: Action<any>) => ModelT[];
export {};
