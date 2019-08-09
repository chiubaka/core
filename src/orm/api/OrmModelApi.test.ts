import fetchMock from "fetch-mock";

import { assertGraphQLCall, fullStore, orm, Plan, store } from "../../../test";

import { Dispatch } from "../../types";
import { createModel, ModelActionType } from "../actions";
import { Model } from "../model";
import { GraphQLApiAdapter } from "./adapters/GraphQLApiAdapter";
import { OrmModelApi } from "./OrmModelApi";

fetchMock.catch();

describe("OrmModelApi", () => {
  const api = new OrmModelApi(Plan as typeof Model, orm);
  // We need to typecast to support promise chaining. Clients will do something similar
  // in mapDispatchToProps by explicitly declaring a type for the dispatch arg.
  const dispatch: Dispatch = fullStore.dispatch;

  afterEach(() => {
    store.clearActions();
    fetchMock.reset();
  });

  describe("with GraphQLApiAdapter", () => {
    describe("#list", () => {
      it("dispatches the correct actions and fires a fetch request to the GraphQL API", async () => {
        const plans = [
          {
            __typename: Plan.modelName,
            id: "1",
            startDate: "2019-10-02",
            endDate: "2019-11-02",
            locations: ["Taipei, Taiwan"],
          },
        ];

        const response: any = {
          data: {
            plans,
          },
        };

        fetchMock.postOnce(`path:${GraphQLApiAdapter.GRAPHQL_PATH}`, response);
        await store.dispatch(api.list());
        assertGraphQLCall();

        const actions = store.getActions();
        expect(actions.length).toEqual(2);

        const startListingModel = actions[0];
        expect(startListingModel.type).toEqual(ModelActionType.START_LISTING_MODEL);
        expect(startListingModel.modelName).toEqual(Plan.modelName);

        const successfulListModel = actions[1];
        expect(successfulListModel.type).toEqual(ModelActionType.SUCCESSFUL_LIST_MODEL);
        expect(successfulListModel.modelName).toEqual(Plan.modelName);
        expect(successfulListModel.items).toEqual(plans);
      });

      it("allows promise chaining", async (done) => {
        dispatch(api.list()).then(() => {
          done();
        });
      });
    });

    describe("#sync", () => {
      const prepareSync = () => {
        const plan = {
          __typename: Plan.modelName,
          id: "1",
          startDate: "2019-09-02",
          endDate: "2019-10-02",
          locations: ["Mexico City, Mexico"],
        };

        dispatch(createModel(Plan as typeof Model, plan));

        const response = {
          data: {
            upsertPlan: {
              __typename: "upsertPlan",
              plan,
            },
          },
        };

        fetchMock.postOnce(`path:${GraphQLApiAdapter.GRAPHQL_PATH}`, response);

        return plan;
      };

      it("dispatches the correct actions and fires a call to the GraphQL API", async () => {
        const plan = prepareSync();
        await dispatch(api.sync(plan.id));
        assertGraphQLCall();

        const session = orm.session(fullStore.getState().orm);
        const updated = session.Plan.withId(plan.id);
        expect(updated.ref.lastSynced).toBeDefined();
        expect(updated.ref.syncing).toBe(false);
      });

      it("supports promise chaining", async (done) => {
        const plan = prepareSync();

        dispatch(api.sync(plan.id)).then(() => {
          done();
        });
      });
    });
  });
});
