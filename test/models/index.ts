import { Model as OrmModel, ORM } from "redux-orm";

import { Comment } from "./Comment";
import { Plan } from "./Plan";
import { Review } from "./Review";
import { Task } from "./Task";
import { User } from "./User";

export * from "./Comment";
export * from "./Plan";
export * from "./Review";
export * from "./Task";
export * from "./User";

export const orm = new ORM();
orm.register(
  Comment as typeof OrmModel,
  Plan as typeof OrmModel,
  Review as typeof OrmModel,
  Task as typeof OrmModel,
  User as typeof OrmModel,
);
