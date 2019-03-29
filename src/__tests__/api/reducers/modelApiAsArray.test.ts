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
  it("should replace the existing model on GET without reordering", () => {
    const newDescription = "one updated";
    const result = reducer(state, Api.successfulGetAction({
      id: "1",
      description: newDescription,
    }));

    expect(result.length).toEqual(state.length);
    expect(result[0].description).toEqual(newDescription);
  });
});
