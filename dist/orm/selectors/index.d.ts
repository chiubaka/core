import { ORM } from "redux-orm";
import { Model } from "../model";
export declare const modelSelector: (orm: ORM<import("redux-orm").ORMCommonState>, model: typeof Model, id: string) => (state: import("redux-orm").ORMCommonState) => any;
