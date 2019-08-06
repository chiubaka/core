import { attr, fk } from "redux-orm";

import { IModel, Model } from "../../src";

import { ITask } from "./Task";
import { IPublicUser } from "./User";

export interface IComment extends IModel {
  task: ITask;
  text: string;
  author: IPublicUser;
}

export class Comment extends Model<IComment> {
  public static fields = {
    ...Model.fields,
    task: fk("Task"),
    text: attr(),
    author: fk("User"),
  };

  public static modelName = "Comment";
}
