import { attr } from "redux-orm";

export interface IModel {
  [propertyName: string]: any;
  id: string;
  lastSynced?: number;
  syncing?: boolean;
}

export const MODEL_FIELDS = {
  id: attr(),
  lastSynced: attr(),
  syncing: attr(),
};
