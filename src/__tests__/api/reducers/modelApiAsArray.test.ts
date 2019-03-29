import {
  IModel,
  ModelApi,
  modelApiAsArray,
} from "../../../api";

interface ITask extends IModel {
  id: string;
  description: string;
}

const Api = new ModelApi<ITask>("task");
const reducer = modelApiAsArray({
  Api,
});

const state = [
  {
    id: "1",
    description: "one",
  },
  {
    id: "2",
    description: "two",
  },
];

describe("modelApiAsArray reducer", () => {
  it("should replace the existing model on SUCCESSFUL_GET_TYPE without reordering", () => {
    const newDescription = "one updated";
    const result = reducer(state, Api.successfulGetAction({
      id: "1",
      description: newDescription,
    }));

    expect(result.length).toEqual(state.length);
    expect(result[0].description).toEqual(newDescription);
  });

  it("should append new models to the end of the array on SUCCESSFUL_CREATE_TYPE", () => {
    const result = reducer(state, Api.successfulCreateAction({
      id: "3",
      description: "three",
    }));

    expect(result.length).toEqual(state.length + 1);
    expect(result[result.length - 1].description).toEqual("three");
  });

  it("should update existing models with new information on SUCCESSFUL_UPDATE_TYPE without reordering", () => {
    const newDescription = "one updated";
    const result = reducer(state, Api.successfulUpdateAction(
      state[0],
      {
        id: "1",
        description: newDescription,
      },
    ));

    expect(result.length).toEqual(state.length);
    expect(result[0].description).toEqual(newDescription);
  });

  it("should remove existing model on SUCCESFUL_DELETE_TYPE", () => {
    const result = reducer(state, Api.successfulDeleteAction(
      state[0],
    ));

    expect(result.length).toEqual(state.length - 1);
    expect(result[0].description).toEqual(state[1].description);
  });
});
