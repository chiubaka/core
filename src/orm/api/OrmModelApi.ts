import { ORM } from "redux-orm";

import { ModelApi } from "../../api";
import { IModelApiAdapter } from "../../api/actions/ModelApi/adapters";
import { Model } from "../model";

// TODO: Fill in type templates here
export class OrmModelApi extends ModelApi<any> {
  public model: typeof Model;
  public orm: ORM;

  constructor(model: typeof Model, orm: ORM, adapter?: IModelApiAdapter<any, any>) {
    super(model.modelName, adapter);
    this.model = model;
    this.orm = orm;
  }
}
