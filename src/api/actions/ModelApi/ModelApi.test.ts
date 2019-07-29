/* tslint:disable:no-implicit-any */
import fetchMock, { MockCall } from "fetch-mock";

import { store } from "../../../../test";

import { RestApiAdapter } from "./adapters";
import { ModelApi } from "./ModelApi";

const LIST_PATH = "/api/plans/";
const LIST_PAYLOAD = [
  {
    id: "1",
  },
  {
    id: "2",
  },
];

const GET_ONE_PATH = `${LIST_PATH}1/`;
const GET_ONE_PAYLOAD = LIST_PAYLOAD[0];

const CREATE_PATH = LIST_PATH;
const CREATE_PAYLOAD = GET_ONE_PAYLOAD;

const UPDATE_PATH = GET_ONE_PATH;
const UPDATE_PAYLOAD = GET_ONE_PAYLOAD;

const DELETE_PATH = GET_ONE_PATH;
const DELETE_PAYLOAD = GET_ONE_PAYLOAD;

describe("ModelApi", () => {
  afterEach(() => {
    store.clearActions();
    fetchMock.reset();
  });

  describe("with RestApiAdapter", () => {
    let api: ModelApi<any>;

    beforeAll(() => {
      api = new ModelApi("plan", new RestApiAdapter("plan"));
    });

    const testGetAll = () => {
      fetchMock.getOnce(`path:${LIST_PATH}`, LIST_PAYLOAD);
      return store.dispatch(api.getAll());
    };

    const testGetOne = () => {
      fetchMock.getOnce(`path:${GET_ONE_PATH}`, GET_ONE_PAYLOAD);
      return store.dispatch(api.get(GET_ONE_PAYLOAD.id));
    };

    const testCreate = () => {
      fetchMock.postOnce(`path:${CREATE_PATH}`, CREATE_PAYLOAD);
      return store.dispatch(api.create(CREATE_PAYLOAD));
    };

    const testUpdate = () => {
      fetchMock.putOnce(`path:${UPDATE_PATH}`, UPDATE_PAYLOAD);
      return store.dispatch(api.update(UPDATE_PAYLOAD, UPDATE_PAYLOAD));
    };

    const testDelete = () => {
      fetchMock.deleteOnce(`path:${DELETE_PATH}`, DELETE_PAYLOAD);
      return store.dispatch(api.delete(DELETE_PAYLOAD));
    };

    describe("#getAll", () => {
      it("dispatches a SUCCESSUL_GET_ALL_PLANS action", async () => {
        await testGetAll();
        assertSingleAction("SUCCESSFUL_GET_ALL_PLANS", LIST_PAYLOAD);
      });

      it("fires a GET request", async () => {
        await testGetAll();
        assertLastCallPath(LIST_PATH);
      });
    });

    describe("#get", () => {
      it("dispatches a SUCCESSFUL_GET_PLAN action", async () => {
        await testGetOne();
        assertSingleAction("SUCCESSFUL_GET_PLAN", GET_ONE_PAYLOAD);
      });

      it("fires a GET request", async () => {
        await testGetOne();
        assertLastCallPath(GET_ONE_PATH);
      });
    });

    describe("#create", () => {
      it("dispatches a SUCCESSFUL_CREATE_PLAN action", async () => {
        await testCreate();
        assertSingleAction("SUCCESSFUL_CREATE_PLAN", CREATE_PAYLOAD);
      });

      it("fires a POST request", async () => {
        await testCreate();
        assertLastCallPath(CREATE_PATH);
      });
    });

    describe("#update", () => {
      it("dispatches a SUCCESSFUL_UPDATE_PLAN action", async () => {
        await testUpdate();
        assertSingleAction("SUCCESSFUL_UPDATE_PLAN");
      });

      it("fires a PUT request", async () => {
        await testUpdate();
        assertLastCallPath(UPDATE_PATH);
      });
    });

    describe("#createOrUpdate", () => {
      it("dispatches a SUCCESSFUL_CREATE_PLAN when there is no id", async () => {
        fetchMock.postOnce(`path:${CREATE_PATH}`, {});
        await store.dispatch(api.createOrUpdate({}, {}));
        assertSingleAction("SUCCESSFUL_CREATE_PLAN");
      });

      it("dispatches a SUCCESSFUL_UPDATE_PLAN when there is an id", async () => {
        fetchMock.putOnce(`path:${UPDATE_PATH}`, {});
        await store.dispatch(api.createOrUpdate({ id: "1" }, { id: "1"}));
        assertSingleAction("SUCCESSFUL_UPDATE_PLAN");
      });
    });

    describe("#delete", () => {
      it("dispatches a SUCCESSFUL_DELETE_PLAN action", async () => {
        await testDelete();
        assertSingleAction("SUCCESSFUL_DELETE_PLAN");
      });

      it("fires a DELETE request", async () => {
        await testDelete();
        assertLastCallPath(DELETE_PATH);
      });
    });

    it("can trigger actions on dependent APIs after updates", async (done) => {
      const TASKS_PATH = "/api/tasks/1/";
      fetchMock.get(`path:${TASKS_PATH}`, { id: "1" });
      fetchMock.putOnce(`path:${UPDATE_PATH}`, UPDATE_PAYLOAD);

      const otherApi = new ModelApi("task", new RestApiAdapter("task"));
      api.addModelUpdateDependency((data: any) => [data.id], otherApi.get, otherApi);

      await store.dispatch(api.update(GET_ONE_PAYLOAD, GET_ONE_PAYLOAD));

      const calls = fetchMock.calls();
      expect(calls.length).toEqual(2);

      assertCallPath(calls[0], UPDATE_PATH);
      assertCallPath(calls[1], TASKS_PATH);

      // Seems like the last action needs to be given priority to dispatch
      // So we cede control and put the check below at the back of the execution queue
      setTimeout(() => {
        const actions = store.getActions();
        expect(actions.length).toEqual(2);
        done();
      }, 0);
    });
  });
});

function assertLastCallPath(expected: string) {
  assertCallPath(fetchMock.lastCall(), expected);
}

function assertCallPath(call: MockCall, expected: string) {
  expect(call[0]).toEqual(expected);
}

function assertSingleAction(type: string, payload?: any) {
  const actions = store.getActions();
  expect(actions.length).toEqual(1);
  assertAction(actions[0], type, payload);
}

function assertAction(action: any, type: string, payload?: any) {
  expect(action.type).toEqual(type);

  if (payload != null) {
    expect(action.payload).toEqual(payload);
  }
}
