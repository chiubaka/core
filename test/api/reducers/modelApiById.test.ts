import {
  IModel,
  IModelById,
  ModelApi,
  modelApiById,
} from "../../../src/api";

interface ITask extends IModel {
  id: string;
  description: string;
}

const Api = new ModelApi<ITask>("task");
const reducer = modelApiById({
  Api,
});

const state: IModelById<ITask> = {
  one: {
    id: "one",
    description: "one",
  },
  two: {
    id: "two",
    description: "two",
  },
};

describe("modelApiAsArray reducer", () => {
  it("should replace the existing model on SUCCESSFUL_GET_TYPE", () => {
    const newDescription = "one updated";
    const taskId = "one";
    const result: IModelById<ITask> = reducer(state, Api.successfulGetAction({
      id: taskId,
      description: newDescription,
    }));

    expect(Object.keys(result).length).toEqual(Object.keys(state).length);
    expect(result[taskId].description).toEqual(newDescription);
  });

  it("should add new models on SUCCESSFUL_CREATE_TYPE", () => {
    const taskId = "three";
    const result: IModelById<ITask> = reducer(state, Api.successfulCreateAction({
      id: taskId,
      description: "three",
    }));

    expect(Object.keys(result).length).toEqual(Object.keys(state).length + 1);
    expect(result[taskId].description).toEqual("three");
  });

  it("should replace the existing model on SUCCESSFUL_UPDATE_TYPE", () => {
    const newDescription = "one updated";
    const taskId = "one";
    const result: IModelById<ITask> = reducer(state, Api.successfulUpdateAction(
      state[taskId],
      {
        id: taskId,
        description: newDescription,
      },
    ));

    expect(Object.keys(result).length).toEqual(Object.keys(state).length);
    expect(result[taskId].description).toEqual(newDescription);
  });

  it("should delete the existing model on SUCCESSFUL_DELETE_TYPE", () => {
    const taskId = "one";
    const result: IModelById<ITask> = reducer(state, Api.successfulDeleteAction(
      state[taskId],
    ));

    expect(Object.keys(result).length).toEqual(Object.keys(state).length - 1);
    expect(result[taskId]).toBeUndefined();
  });
});
