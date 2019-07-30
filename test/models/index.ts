import { Model as OrmModel, ORM } from "redux-orm";

import { Plan } from "./Plan";

export * from "./Plan";

export const orm = new ORM();
orm.register(
  Plan as typeof OrmModel,
);
