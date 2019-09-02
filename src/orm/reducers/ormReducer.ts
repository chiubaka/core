import { Action } from "redux";
import { Model, ORM, ORMCommonState, SessionWithModels } from "redux-orm";

import {
  IModelCreate,
  IModelIdAction,
  IModelPayloadAction,
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
        updateModel(model, action as IModelPayloadAction);
        break;
      }
      case ModelActionType.DESTROY_MODEL: {
        destroyModel(model, action as IModelIdAction);
        break;
      }
      case ModelActionType.SUCCESSFUL_LIST_MODEL:
      case ModelActionType.SUCCESSFUL_SEARCH_MODEL: {
        successfulListModel(model, action as ISuccessfulListModel);
        break;
      }
      case ModelActionType.SUCCESSFUL_GET_MODEL: {
        successfulGetModel(model, action as IModelPayloadAction);
        break;
      }
      case ModelActionType.START_SYNCING_MODEL: {
        startSyncingModel(model, action as IModelIdAction);
        break;
      }
      case ModelActionType.SUCCESSFUL_SYNC_MODEL: {
        successfulSyncModel(model, action as IModelPayloadAction);
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

function createModel(model: typeof Model, action: IModelPayloadAction) {
  model.create(action.payload);
}

function updateModel(model: typeof Model, action: IModelPayloadAction) {
  const payload = action.payload;
  model.upsert(payload);
}

function destroyModel(model: typeof Model, action: IModelIdAction) {
  model.withId(action.id).delete();
}

function successfulListModel(model: typeof Model, action: ISuccessfulListModel) {
  action.items.forEach((item: IModel) => {
    model.upsert({
      ...item,
      lastSynced: Date.now(),
      syncing: false,
    });
  });
}

function successfulGetModel(model: typeof Model, action: IModelPayloadAction) {
  const payload = action.payload;
  model.upsert(payload);
}

function startSyncingModel(model: typeof Model, action: IModelIdAction) {
  model.withId(action.id).update({syncing: true});
}

function successfulSyncModel(model: typeof Model, action: IModelPayloadAction) {
  const updatedAction = {
    ...action,
    payload: {
      ...action.payload,
      lastSynced: Date.now(),
      syncing: false,
    },
  };
  updateModel(model, updatedAction);
}
