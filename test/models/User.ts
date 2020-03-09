import { attr } from "redux-orm";

import { IModel, Model } from "../../src";

export interface IPublicUser extends IModel {
  name: string;
  profilePhoto: string;
}

export class User extends Model<IPublicUser> {
  public static fields = {
    ...Model.fields,
    name: attr(),
    profilePhoto: attr(),
  };

  public static modelName = "User";
}
