import { orm } from "../../../test";

describe("Model", () => {
  const session = orm.session(orm.getEmptyState());

  describe("#forBackend", () => {
    it("strips all local fields from the model", () => {
      session.Plan.create({
        id: "1",
        startDate: "2019-09-02",
        endDate: "2019-10-03",
        locations: ["Mexico City, Mexico"],
        lastSynced: Date.now(),
        syncing: false,
      });

      const plan = session.Plan.withId("1");
      const planForBackend = plan.forBackend();

      expect(planForBackend.lastSynced).toBeUndefined();
      expect(planForBackend.syncing).toBeUndefined();
    });
  });
});
