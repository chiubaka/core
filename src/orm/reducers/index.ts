import { Action } from "redux";
import { Model, ORM, ORMCommonState, SessionWithModels } from "redux-orm";

import {
  IModelCreate,
  IModelIdAction,
  IModelUpdate,
  isModelAction,
  ISuccessfulListModel,
  ModelAction,
  ModelActionType,
} from "../actions";
import { IModel } from "../model";

export function ormReducer(orm: ORM) {
  return (database: ORMCommonState = orm.getEmptyState(), action: ModelAction) => {
    const session = orm.session(database);
    const model = getModel(action, session);
    if (model == null) {
      return session.state;
    }

    switch (action.type) {
      case ModelActionType.CREATE_MODEL: {
        createModel(model, action as IModelCreate);
        break;
      }
      case ModelActionType.UPDATE_MODEL: {
        updateModel(model, action as IModelUpdate);
        break;
      }
      case ModelActionType.DESTROY_MODEL: {
        destroyModel(model, action as IModelIdAction);
      }
      case ModelActionType.SUCCESSFUL_LIST_MODEL: {
        successfulListModel(model, action as ISuccessfulListModel);
        break;
      }
      case ModelActionType.START_SYNCING_MODEL: {
        startSyncimgModel(model, action as IModelIdAction);
        break;
      }
      case ModelActionType.SUCCESSFUL_SYNC_MODEL: {
        updateModel(model, action as IModelUpdate);
        break;
      }
    }

    return session.state;
  };
}

function getModel(action: Action, session: SessionWithModels<ORMCommonState>): typeof Model {
  if (isModelAction(action)) {
    return session[action.modelName];
  }

  return null;
}

function createModel(model: typeof Model, action: IModelUpdate) {
  model.create(action.payload);
}

function updateModel(model: typeof Model, action: IModelUpdate) {
  const payload = action.payload;
  model.withId(payload.id).update(payload);
}

function destroyModel(model: typeof Model, action: IModelIdAction) {
  model.withId(action.id).delete();
}

function successfulListModel(model: typeof Model, action: ISuccessfulListModel) {
  action.items.forEach((item: IModel) => {
    model.upsert(item);
  });
}

function startSyncimgModel(model: typeof Model, action: IModelIdAction) {
  model.withId(action.id).update({syncing: true});
}
