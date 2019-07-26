import { createSelector as createOrmSelector, ORM } from "redux-orm";

import { Model } from "../model";

export const modelSelector = (orm: ORM, model: typeof Model, id: string) => {
  return createOrmSelector(
    orm,
    (session) => {
      return session[model.modelName].withId(id);
    },
  );
};
