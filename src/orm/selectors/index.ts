import { createSelector as createOrmSelector, ORM } from "redux-orm";

import { Model } from "../model";

export const modelIdsSelector = (orm: ORM, model: typeof Model, sortFn: (a: any, b: any) => number = null) => {
  return createOrmSelector(
    orm,
    (session) => {
      const instances = session[model.modelName].all().toModelArray();
      if (sortFn != null) {
        instances.sort(sortFn);
      }
      return instances.map((instance) => instance.id);
    },
  );
};

export const modelSelector = (orm: ORM, model: typeof Model, id: string) => {
  return createOrmSelector(
    orm,
    (session) => {
      return session[model.modelName].withId(id);
    },
  );
};
