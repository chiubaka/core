import { attr } from "redux-orm";

import { IModel, Model } from "../../src";

export interface IPlan extends IModel {
  startDate: string;
  endDate: string;
  locations: string[];
}

export class Plan extends Model<IPlan> {
  public static fields = {
    ...Model.fields,
    startDate: attr(),
    endDate: attr(),
    locations: attr(),
  };

  public static modelName = "Plan";
}
