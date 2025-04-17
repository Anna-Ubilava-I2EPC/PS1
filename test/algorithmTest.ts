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
const fc0 = new Flashcard("Q0", "A0", "", []);
const fc1 = new Flashcard("Q1", "A1", "H1", []);
const fc2 = new Flashcard("Q2", "A2", " %#&* hehe^_^", []);
const fc3 = new Flashcard("Q3", "A3", "H3", []);
const fc4 = new Flashcard("Q4", "A4", "", []);
const fc5 = new Flashcard("Q5", "", "", []);
const fc6 = new Flashcard("Q6", "A6", "H6", []);

/*
 * Testing strategy for toBucketSets():
 *
 * partitions:
 * 1. empty input
 * 2. buckets with consecutive indices (0,1,2,...)
 * 3. buckets with non-consecutive indices (0,2,3,5...) -> empty sets for left out buckets
 * 4. Buckets with empty sets
 * 5. Only one bucket with one flashcard
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
 *Partitions:
 1. [] empty array as an input (no buckets); -> undefined
 2. [Set(), Set()] - empty bucket(s); -> undefined
 3. [Set([fc])]- one non-empty bucket; return {0:0}
 4. [Set([fc]), Set(), Set()] multiple buckets with non-empty bucket at start; 
 5. [Set(), Set([fc]), Set()] multiple buckets with non-empty bucket in the middle; 
 6. [Set(), Set(), Set([fc])] multiple buckets with non-empty bucket at end; 
 7. [Set([fc1]), Set(), Set([fc2])] multiple non-empty buckets.
 8. [Set([fc1]), Set(), Set(), Set([fc2])]  Non-empty buckets at the edges, empty in the middle
 9. all non empty buckets

 */
describe("getBucketRange()", () => {
  // partition 1: []
  it("range is undefined for an empty array", () => {
    assert.deepStrictEqual(getBucketRange([]), undefined);
  });

  // partition 2: empty bucket(s)
  it("range is undefined when all buckets are empty ", () => {
    const buckets = [
      new Set<Flashcard>(),
      new Set<Flashcard>(),
      new Set<Flashcard>(),
    ];
    // const buckets: Set<Flashcard>[] = [new Set(), new Set(), new Set()];
    assert.deepStrictEqual(getBucketRange(buckets), undefined);
  });

  // partition 3: single non-empty bucket
  it("finds range for a single non-empty bucket", () => {
    const buckets = [new Set<Flashcard>([fc0, fc1])];
    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 0,
      maxBucket: 0,
    });
  });

  // partition 4:  non-empty bucket only at start
  it("finds range when only first bucket is non-empty", () => {
    const buckets: Set<Flashcard>[] = [new Set([fc0]), new Set(), new Set()];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 0,
      maxBucket: 0,
    });
  });

  // partition 5:  non-empty bucket only in middle
  it("finds range when only middle bucket is non-empty", () => {
    const buckets: Set<Flashcard>[] = [new Set(), new Set([fc0]), new Set()];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 1,
      maxBucket: 1,
    });
  });

  // partition 6:  non-empty bucket only at end
  it("finds range when only last bucket is non-empty", () => {
    const buckets: Set<Flashcard>[] = [new Set(), new Set(), new Set([fc0])];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 2,
      maxBucket: 2,
    });
  });

  // partition 7:  multiple non-empty buckets.
  it("finds range for multiple non-empty buckets", () => {
    const buckets: Set<Flashcard>[] = [
      new Set(),
      new Set(),
      new Set([fc0]),
      new Set(),
      new Set([fc3]),
    ];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 2,
      maxBucket: 4,
    });
  });

  // partition 8: Non-empty buckets only at the edges
  it("finds range when non-empty buckets are only at the edges", () => {
    const buckets: Set<Flashcard>[] = [
      new Set([fc0]),
      new Set(),
      new Set(),
      new Set([fc3]),
    ];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 0,
      maxBucket: 3,
    });
  });

  // partition 9: all non-empty buckets
  it("finds range when all buckets are non-empty", () => {
    const buckets: Set<Flashcard>[] = [
      new Set([fc0]),
      new Set([fc2]),
      new Set([fc3]),
    ];

    assert.deepStrictEqual(getBucketRange(buckets), {
      minBucket: 0,
      maxBucket: 2,
    });
  });
});

/*
 * Testing strategy for practice():
 *
 * partitions:
 * 1. empty array
 * 2. all empty buckets
 * 3. day 0 (first day) with only bucket0 nonempty
 * 4. day 0 with multiple nonempty buckets
 * 5. day 1
 * 6. day 2 (only 0 is practiced when day is even number)
 * 7. day 15 and bucket 4 is the retired bucket (even though it is the 2^4th day, only 0, 1, 2, 3 are included)
 *
 */
describe("practice()", () => {
  it("returns empty set for an empty array of buckets", () => {
    const buckets: Array<Set<Flashcard>> = [];
    assert.deepStrictEqual(practice(buckets, 0), new Set<Flashcard>());
  });

  it("returns empty set for an array of all empty buckets", () => {
    const buckets: Array<Set<Flashcard>> = [new Set(), new Set(), new Set()];
    assert.deepStrictEqual(practice(buckets, 0), new Set<Flashcard>());
  });

  it("selects flashcards in an only non-empty bucket0 on day0 ", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set([fc0, fc1]),
      new Set(),
      new Set(),
    ];
    const actual = practice(buckets, 0);
    const expected = new Set([fc0, fc1]);
    assert.deepStrictEqual(actual, expected);
  });

  it("selects flashcards in bucket0 on day0 from multiple non-empty buckets ", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set([fc0, fc1]),
      new Set([fc2]),
      new Set([fc3]),
    ];
    const actual = practice(buckets, 0);
    const expected = new Set([fc0, fc1]);
    assert.deepStrictEqual(actual, expected);
  });

  it("selects flashcards from buckets 0 and 1 on day1 ", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set([fc0, fc1]),
      new Set([fc2]),
      new Set([fc3]),
    ];

    const expected = new Set([fc0, fc1]);
    assert.deepStrictEqual(practice(buckets, 0), expected);
  });

  it("selects flashcards from bucket 0 on day2 (or eny k'th day when k is odd (so day is even)", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set([fc0, fc1]),
      new Set([fc2]),
      new Set([fc3]),
    ];

    const expected = new Set([fc0, fc1]);
    assert.deepStrictEqual(practice(buckets, 0), expected);
  });

  it("does not select flashcards from a retired bucket4 even at the 2^4th day)  ", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set([fc0, fc1]),
      new Set([fc2]),
      new Set([fc3]),
      new Set([fc4, fc5]),
      new Set([fc6]),
    ];

    const expected = new Set([fc0, fc1, fc2, fc3, fc4, fc5]);
    assert.deepStrictEqual(practice(buckets, 15), expected);
  });
});

/*
 * Testing strategy for update():
 *
 * Partitions:
 * 1. card is in bucket 0; Wrong; stays in 0
 * 2. card is in bucket>0; Wrong; moved to bucket0
 * 3. card is in bucket 0; Hard; stays in bucket 0 (can’t go lower)
 * 4. card is in bucket>0; Hard; moves to bucket i-1
 * 5. card is in retired bucket; Easy; stays there
 * 6. card is in any other bucket; Easy; moves to bucket i+1
 * 7. card is not found in any bucket; throws an error
 * 8. buckets is empty; throws an error
 * 9. multiple cards in a bucket; only the right card is moved
 *
 */
describe("update()", () => {
  const buckets: BucketMap = new Map([
    [0, new Set([fc0])],
    [1, new Set([fc3])],
    [2, new Set([fc4])],
  ]);

  //1
  it("card is in bucket 0; Wrong; stays in 0", () => {
    assert.deepStrictEqual(update(buckets, fc0, 0), buckets);
  });

  //2
  it("card is in bucket>0; Wrong; moved to bucket0", () => {
    const expected: BucketMap = new Map([
      [0, new Set([fc0, fc4])],
      [1, new Set([fc3])],
      [2, new Set()],
    ]);
    assert.deepStrictEqual(update(buckets, fc4, 0), expected);
  });

  //3
  it("card is in bucket 0; Hard; stays in bucket 0 ", () => {
    assert.deepStrictEqual(update(buckets, fc0, 1), buckets);
  });

  //4
  it("card is in bucket>0; Hard; moves to bucket i-1", () => {
    const expected: BucketMap = new Map([
      [0, new Set([fc0])],
      [1, new Set([fc3, fc4])],
      [2, new Set()],
    ]);

    assert.deepStrictEqual(update(buckets, fc4, 1), expected);
  });

  //5
  it("card is in retired bucket; Easy; stays there", () => {
    assert.deepStrictEqual(update(buckets, fc4, 2), buckets);
  });

  //6
  it("card is in any other bucket; Easy; moves to bucket i+1", () => {
    const expected: BucketMap = new Map([
      [0, new Set()],
      [1, new Set([fc0, fc3])],
      [2, new Set([fc4])],
    ]);

    assert.deepStrictEqual(update(buckets, fc0, 2), expected);
  });

  //7
  it("throws an error when card is not found in any bucket", () => {
    assert.throws(() => update(buckets, fc6, 0));
  });

  //8
  it("throws an error when buckets is empty ", () => {
    const buckets: BucketMap = new Map();
    assert.throws(() => update(buckets, fc0, 0));
  });

  //9
  it("only the current card is moved when there are multiple cards in a bucket; ", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([fc0, fc1, fc2])],
      [1, new Set([fc3, fc6])],
      [2, new Set([fc4, fc5])],
    ]);

    const expected: BucketMap = new Map([
      [0, new Set([fc0, fc2])],
      [1, new Set([fc1, fc3, fc6])],
      [2, new Set([fc4, fc5])],
    ]);

    assert.deepStrictEqual(update(buckets, fc1, 2), expected);
  });
});

/*
 * Testing strategy for getHint():
 *
 * Partitions:
 * 1.a card has an available hint; it is used
 * 2.Hint with special characters and spaces
 * 3.hint is empty; uses a part of the answer as a hint
 * 4.hint is empty and answer is short
 * 5.answer and hint are both empty.
 *
 */
describe("getHint()", () => {
  //some tests from weak getHint()
  //1
  it("returns a string when hint is regular string", () => {
    assert.strictEqual(getHint(fc1), "H1");
  });

  //2
  it("handles a hint with special characters and spaces", () => {
    assert.strictEqual(getHint(fc2), " %#&* hehe^_^");
  });

  // new tests for strong spec
  //3
  it("uses a part of the answer as a hint when card.hint is empty; ", () => {
    const card = new Flashcard("Capital of Georgia?", "Tbilisi", "", []);
    assert.strictEqual(getHint(card), "Starts with 'Tbili'");
  });

  //4
  it("handles short answers when hint is empty", () => {
    const card = new Flashcard("What century is it now?", "21", "", []);
    assert.strictEqual(getHint(card), "Starts with '21'");
  });

  //5
  it("handles empty answer and hint", () => {
    assert.strictEqual(getHint(fc5), "no hint available");
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
