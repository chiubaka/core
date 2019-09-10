import { ORM, ORMCommonState } from "redux-orm";
import { ModelAction } from "../actions";
export declare function ormReducer(orm: ORM): (database: ORMCommonState, action: ModelAction) => ORMCommonState;
