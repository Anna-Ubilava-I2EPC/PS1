import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

// randrom flashcards
const fc0 = new Flashcard("Q0", "A0", "H0", []);
const fc1 = new Flashcard("Q1", "A1", "H1", []);
const fc2 = new Flashcard("Q2", "A2", "H2", []);
const fc3 = new Flashcard("Q3", "A3", "H3", []);
const fc4 = new Flashcard("Q4", "A4", "H4", []);
const fc5 = new Flashcard("Q5", "A5", "H5", []);

/*
 * Testing strategy for toBucketSets():
 *
 * partitions:
 * 1. empty input
 * 2. buckets with consecutive indices (0,1,2,...)
 * 3. buckets with non-consecutive indices (0,2,3,5...) -> empty sets for left out buckets
 * 4. Buckets with empty sets
 * 5. Only one bucket with one flasshcard
 * 6. one bucket with multiple flashcars.
 * 7. multiple buckets with multiple flashcards.
 */
describe("toBucketSets()", () => {
  // partition 1: empty map
  it("covers empty input map; returns an empty array", () => {
    const buckets: BucketMap = new Map();
    assert.deepStrictEqual(toBucketSets(buckets), []);
  });

  // partition 2: consecutive indices
  it("returns an array of sets for consecutive buckets: arr[i] = bucket i", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([fc0])],
      [1, new Set([fc3])],
      [2, new Set([fc4])],
    ]);

    const expected = [new Set([fc0]), new Set([fc3]), new Set([fc4])];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });

  // partition 3: non-consecutive indices
  it("fills in empty buckets for missing keys", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([fc0])],
      [2, new Set([fc1])],
    ]);

    const expected = [
      new Set([fc0]),
      new Set(), // empty bucket1
      new Set([fc1]),
    ];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });

  // partition 4: buckets with empty sets
  it("includes empty sets for explicitly provided buckets", () => {
    const buckets: BucketMap = new Map([
      [0, new Set()],
      [1, new Set([fc1])],
    ]);

    const expected = [new Set(), new Set([fc1])];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });

  // Partition 5: only one bucket with a single flashcard
  it("handles a map with only one bucket", () => {
    const buckets: BucketMap = new Map([[3, new Set([fc3])]]);

    const expected = [new Set(), new Set(), new Set(), new Set([fc3])];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });

  // Partition 6: One bucket with multiple flashcars.
  it("handles multiple flashcards in the same bucket", () => {
    const buckets: BucketMap = new Map([[0, new Set([fc0, fc1, fc2])]]);

    const expected = [new Set([fc0, fc1, fc2])];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });

  // Partition 7: multiple buckets with multiple flashcars.
  it("handles multiple flashcards in the same bucket", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([fc0, fc1, fc2])],
      [1, new Set([fc3, fc4])],
    ]);

    const expected = [new Set([fc0, fc1, fc2]), new Set([fc3, fc4])];

    assert.deepStrictEqual(toBucketSets(buckets), expected);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
