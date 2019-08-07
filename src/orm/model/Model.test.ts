import { ORMCommonState, SessionWithModels } from "redux-orm";

import { IComment, IReview, ITask, orm, Review, Task, User } from "../../../test";

import { Model } from "./Model";

const TEST_ASSIGNEE = {
  id: "1",
  name: "Daniel Chiu",
  profilePhoto: "https://foobar.com/daniel.jpg",
};

const TEST_REVIEWER = {
  id: "2",
  name: "Richard Lo",
  profilePhoto: "https://foobar.com/richard.jpg",
};

const NEW_TASK = {
  description: "foobar",
  assignee: TEST_ASSIGNEE,
  comments: [
    {
      id: "1",
      text: "What garbage!",
      author: TEST_ASSIGNEE,
    },
  ],
  review: {
    id: "1",
    text: "A monkey could have done better",
    reviewer: TEST_REVIEWER,
  },
};

describe("Model", () => {
  const emptySession = orm.session(orm.getEmptyState());

  const createTask = (session = emptySession, task = NEW_TASK) => {
    session.Task.create(task);
    return session;
  };

  const expectCorrectOrmState = (session: SessionWithModels<ORMCommonState>) => {
    // Verify Task state
    const tasks = session.Task.all();
    expect(tasks.count()).toEqual(1);
    const task = session.Task.all().first();
    // M2M fields are not left on the reference, so there shouldn't be an entry for comments here
    expect(task.ref).toMatchObject({
      description: NEW_TASK.description,
      assignee: NEW_TASK.assignee.id,
      review: NEW_TASK.review.id,
    });

    // Verify User state
    const users = session.User.all();
    // One for the assignee, one for the reviewer
    expect(users.count()).toEqual(2);
    const assignee = session.User.withId(TEST_ASSIGNEE.id);
    expect(assignee.ref).toEqual(TEST_ASSIGNEE);
    const reviewer = session.User.withId(TEST_REVIEWER.id);
    expect(reviewer.ref).toEqual(TEST_REVIEWER);

    // Verify Comment state
    const comments = session.Comment.all();
    expect(comments.count()).toEqual(1);
    const comment = session.Comment.withId(NEW_TASK.comments[0].id);
    expect(comment.ref).toMatchObject({
      text: NEW_TASK.comments[0].text,
      author: TEST_ASSIGNEE.id,
    });

    // Verify Review state
    const reviews = session.Review.all();
    expect(reviews.count()).toEqual(1);
    const review = session.Review.withId(NEW_TASK.review.id);
    expect(review.ref).toMatchObject({
      // Only the model that declares the oneToOne gets a ref entry, apparently,
      // so no task ref expected here.
      text: NEW_TASK.review.text,
      reviewer: NEW_TASK.review.reviewer.id,
    });

    // Verify relationships
    // Verify that task got assignee and vice-versa
    expect(task.assignee.equals(assignee)).toBe(true);
    expect(assignee.assignedTasks.count()).toEqual(1);
    expect(
      assignee.assignedTasks
        .filter((assigneeTask: ITask) => assigneeTask.id === task.ref.id)
        .first()
        .equals(task),
    ).toBe(true);

    // Verify that task got review and vice-versa
    expect(task.review.equals(review)).toBe(true);
    expect(review.task.equals(task)).toBe(true);

    // Verify that task got comment and vice-versa
    expect(task.comments.count()).toEqual(1);
    expect(
      task.comments
        .filter((taskComment: IComment) => taskComment.id === comment.ref.id)
        .first()
        .equals(comment),
    ).toBe(true);
    expect(comment.task.equals(task)).toBe(true);

    // Verify that comment got author and vice-versa
    expect(comment.author.equals(assignee)).toBe(true);
    expect(assignee.commentSet.count()).toEqual(1);
    expect(
      assignee.commentSet
        .filter((assigneeComment: IComment) => assigneeComment.id === comment.ref.id)
        .first()
        .equals(comment),
    ).toBe(true);

    // Verify that review got reviewer and vice-versa
    expect(review.reviewer.equals(reviewer)).toBe(true);
    expect(reviewer.reviewSet.count()).toEqual(1);
    expect(
      reviewer.reviewSet
        .filter((reviewerReview: IReview) => reviewerReview.id === review.ref.id)
        .first()
        .equals(review),
    );
  };

  describe(".create", () => {
    it("handles creation of related instances", () => {
      const session = createTask();
      expectCorrectOrmState(session);
    });

    it("handles updating related instances", () => {
      let session = orm.session(orm.getEmptyState());
      session.User.create({
        ...TEST_ASSIGNEE,
        profilePhoto: "https://bogus.com/daniel.jpg",
      });

      session = createTask(session);
      expectCorrectOrmState(session);
    });
  });

  describe("#update", () => {
    it("handles creation of related instances", () => {
      const session = orm.session(orm.getEmptyState());
      const task = session.Task.create({
        description: "Test",
      });
      task.update(NEW_TASK);
      expectCorrectOrmState(session);
    });

    it("handles updating related instances", () => {
      const session = orm.session(orm.getEmptyState());
      session.User.create({
        ...TEST_ASSIGNEE,
        profilePhoto: "https://bogus.com/daniel.jpg",
      });
      const task = session.Task.create({
        description: "Test",
      });
      task.update(NEW_TASK);
      expectCorrectOrmState(session);
    });
  });

  describe("#upsert", () => {
    it("handles creating related instances when instances doesn't exist", () => {
      const session = orm.session(orm.getEmptyState());
      session.Task.upsert(NEW_TASK);
      expectCorrectOrmState(session);
    });

    it("handles updating related instances when instance already exists", () => {
      const session = orm.session(orm.getEmptyState());
      const task = session.Task.create({
        description: "Test",
      });
      session.Task.upsert({
        id: task.ref.id,
        ...NEW_TASK,
      });
      expectCorrectOrmState(session);
    });
  });

  describe(".getRelationshipMap", () => {
    it("returns a mapping of relational fields to their corresponding model names", () => {
      expect(Task.getRelationshipMap()).toEqual({
        assignee: "User",
        comments: "Comment",
        creator: "User",
        review: "Review",
      });
    });
  });

  describe(".getBackRelationFieldName", () => {
    it("handles oneToOne relationships properly", () => {
      expect(Task.getBackRelationFieldName("review", Review as typeof Model)).toEqual("task");
      expect(Review.getBackRelationFieldName("task", Task as typeof Model)).toEqual("review");
    });

    it("handles relations defined with the `relatedName` option properly", () => {
      expect(Task.getBackRelationFieldName("assignee", User as typeof Model)).toEqual("assignedTasks");
      expect(Task.getBackRelationFieldName("creator", User as typeof Model)).toEqual("createdTasks");

      expect(User.getBackRelationFieldName("assignedTasks", Task as typeof Model)).toEqual("assignee");
      expect(User.getBackRelationFieldName("createdTasks", Task as typeof Model)).toEqual("creator");
    });
  });

  describe("#forBackend", () => {
    it("strips all local fields from the model", () => {
      const session = orm.session(orm.getEmptyState());

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
