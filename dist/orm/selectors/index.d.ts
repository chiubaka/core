import { ORM } from "redux-orm";
import { Model } from "../model";
export declare const modelIdsSelector: (orm: ORM<import("redux-orm").ORMCommonState>, model: typeof Model, sortFn?: (a: any, b: any) => number) => (state: import("redux-orm").ORMCommonState) => any;
export declare const modelSelector: (orm: ORM<import("redux-orm").ORMCommonState>, model: typeof Model, id: string) => (state: import("redux-orm").ORMCommonState) => any;
