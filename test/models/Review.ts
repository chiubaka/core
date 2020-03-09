import { attr, fk } from "redux-orm";

import { IModel, Model } from "../../src";

import { ITask } from "./Task";
import { IPublicUser } from "./User";

export interface IReview extends IModel {
  reviewer: IPublicUser;
  task: ITask;
  text: string;
}

export class Review extends Model<IReview> {
  public static fields = {
    ...Model.fields,
    reviewer: fk("User"),
    text: attr(),
  };

  public static modelName = "Review";
}
