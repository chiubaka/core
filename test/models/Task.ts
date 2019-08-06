import { attr, fk, many, oneToOne } from "redux-orm";

import { IModel, Model } from "../../src";

import { IComment } from "./Comment";
import { IReview } from "./Review";
import { IPublicUser } from "./User";

export interface ITask extends IModel {
  description: string;
  assignee: IPublicUser;
  comments: IComment[];
  review: IReview;
}

export class Task extends Model<ITask> {
  public static fields = {
    ...Model.fields,
    description: attr(),
    assignee: fk("User"),
    comments: many("Comment"),
    review: oneToOne("Review"),
  };

  public static modelName = "Task";
}
