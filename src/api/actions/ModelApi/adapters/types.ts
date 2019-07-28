import { ModelApi } from "../";
import { ApiAction } from "../../types";

export interface IModelApiAdapter<BackendType, FrontendType> {
  getAll: () => ApiAction<FrontendType[]>;
  get: (id: string) => ApiAction<FrontendType>;
  create: (payload: Partial<FrontendType>) => ApiAction<FrontendType>;
  update: (original: FrontendType, updated: FrontendType) => ApiAction<FrontendType>;
  delete: (deleted: FrontendType) => ApiAction<unknown>;
  setApi: (api: ModelApi<BackendType, FrontendType>) => void;
}
