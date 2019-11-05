import { ORMCommonState, SessionWithModels } from "redux-orm";

import { IPlan, orm, Plan } from "../../../test";

import {
  createModel,
  destroyModel,
  startSyncingModel,
  successfulListModel,
  successfulSyncModel,
  updateModel,
} from "../actions";
import { Model, NewModel } from "../model";
import { ormReducer } from "./ormReducer";

const NEW_PLAN = {
  startDate: "2019-10-03",
  endDate: "2019-11-03",
  locations: [ "Taipei, Taiwan" ],
};

describe("ormReducer", () => {
  const reducer = ormReducer(orm);
  const emptySession = orm.session(orm.getEmptyState());

  function createPlan(session: SessionWithModels<ORMCommonState> = emptySession, plan: NewModel<IPlan> = NEW_PLAN) {
    const action = createModel(Plan as typeof Model, plan);

    const newState = reducer(session.state, action);
    return orm.session(newState);
  }

  function getPlanCount(session: SessionWithModels<ORMCommonState>) {
    return session.Plan.all().count();
  }

  function getPlan(session: SessionWithModels<ORMCommonState>) {
    const PlanModel = session.Plan;
    if (getPlanCount(session) > 0) {
      return PlanModel.all().first().ref;
    } else {
      return null;
    }
  }

  it("responds to the CREATE_MODEL action by creating a model instance", () => {
    const session = createPlan();

    // Assert we have exactly one item in the DB
    expect(getPlanCount(session)).toEqual(1);

    const createdPlan = getPlan(session);
    // Assert that an ID was assigned to the new instance
    expect(createdPlan.id).toBeDefined();
    // Assert that the new instance has the attributes we defined
    expect(createdPlan).toMatchObject(NEW_PLAN);
  });

  it("responds to the UPDATE_MODEL action by updating the specified model instance", () => {
    let session = createPlan();
    let plan = getPlan(session);

    const update = {
      id: plan.id,
      startDate: "2020-02-04",
    };

    const action = updateModel(Plan as typeof Model, update);

    session = orm.session(reducer(session.state, action));
    plan = getPlan(session);

    // Assert that instance count remained the same
    expect(getPlanCount(session)).toEqual(1);
    // Assert that plan was updated
    expect(plan).toMatchObject(update);
  });

  it("responds to the DESTROY_MODEL action by deleting the specified model instance", () => {
    let session = createPlan();
    let plan = getPlan(session);

    const action = destroyModel(Plan as typeof Model, plan.id);

    session = orm.session(reducer(session.state, action));
    plan = getPlan(session);

    expect(plan).toBeNull();
    expect(getPlanCount(session)).toEqual(0);
  });

  it("responds to SUCCESSFUL_LIST_MODEL by upserting all models in the payload", () => {
    let session = createPlan();
    let plan = getPlan(session);

    const updatedPlan = {
      ...plan,
      startDate: "2020-04-05",
    };

    const newPlan = {
      id: "foobar",
      startDate: "2018-03-04",
      endDate: "2019-02-04",
    };

    const items = [
      updatedPlan,
      newPlan,
    ];

    const action = successfulListModel(Plan as typeof Model, items);

    session = orm.session(reducer(session.state, action));

    // Assert that we have the right instance count, 1 updated, and 1 created.
    expect(getPlanCount(session)).toEqual(2);

    plan = session.Plan.withId(plan.id).ref;
    // Assert that the original plan was updated
    delete updatedPlan.lastUpdated;
    expect(plan).toMatchObject(updatedPlan);
    // Assert that the lastSynced variable was set, since we pulled changes from a remote
    expect(plan.lastSynced).toBeDefined();

    const created = session.Plan.withId(newPlan.id).ref;
    // Assert that a new plan was created for the one that didn't match an existing plan
    expect(created).toMatchObject(newPlan);
    // Assert that the lastSynced variable was set, since we pulled changes from a remote
    expect(created.lastSynced).toBeDefined();
  });

  it("responds to START_SYNCING_MODEL by marking the specified model as syncing", () => {
    let session = createPlan();
    let plan = getPlan(session);

    const action = startSyncingModel(Plan as typeof Model, plan.id);
    session = orm.session(reducer(session.state, action));
    plan = getPlan(session);

    // Assert that sync state has been updated on the instance
    expect(plan.syncing).toBe(true);
  });

  it("responds to SUCCESSFUL_SYNC_MODEL by updating the specified model and marking that it is done syncing", () => {
    let session = createPlan();
    let plan = getPlan(session);

    const updatedPlan = {
      ...plan,
      locations: ["Mexico City, Mexico"],
    };

    const action = successfulSyncModel(Plan as typeof Model, updatedPlan);
    session = orm.session(reducer(session.state, action));
    plan = getPlan(session);

    // Assert that total number of instances hasn't changed
    expect(getPlanCount(session)).toEqual(1);
    // Assert that updates were applied to the instance
    delete updatedPlan.lastUpdated;
    expect(plan).toMatchObject(updatedPlan);
    // Assert that sync state was updated
    expect(plan.lastSynced).toBeDefined();
    expect(plan.syncing).toBe(false);
  });
});
