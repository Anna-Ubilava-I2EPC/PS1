"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const flashcards_1 = require("../src/flashcards");
const algorithm_1 = require("../src/algorithm");
// randrom flashcards
const fc0 = new flashcards_1.Flashcard("Q0", "A0", "H0", []);
const fc1 = new flashcards_1.Flashcard("Q1", "A1", "H1", []);
const fc2 = new flashcards_1.Flashcard("Q2", "A2", "H2", []);
const fc3 = new flashcards_1.Flashcard("Q3", "A3", "H3", []);
const fc4 = new flashcards_1.Flashcard("Q4", "A4", "H4", []);
const fc5 = new flashcards_1.Flashcard("Q5", "A5", "H5", []);
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
        const buckets = new Map();
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), []);
    });
    // partition 2: consecutive indices
    it("returns an array of sets for consecutive buckets: arr[i] = bucket i", () => {
        const buckets = new Map([
            [0, new Set([fc0])],
            [1, new Set([fc3])],
            [2, new Set([fc4])],
        ]);
        const expected = [new Set([fc0]), new Set([fc3]), new Set([fc4])];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
    });
    // partition 3: non-consecutive indices
    it("fills in empty buckets for missing keys", () => {
        const buckets = new Map([
            [0, new Set([fc0])],
            [2, new Set([fc1])],
        ]);
        const expected = [
            new Set([fc0]),
            new Set(), // empty bucket1
            new Set([fc1]),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
    });
    // partition 4: buckets with empty sets
    it("includes empty sets for explicitly provided buckets", () => {
        const buckets = new Map([
            [0, new Set()],
            [1, new Set([fc1])],
        ]);
        const expected = [new Set(), new Set([fc1])];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
    });
    // Partition 5: only one bucket with a single flashcard
    it("handles a map with only one bucket", () => {
        const buckets = new Map([[3, new Set([fc3])]]);
        const expected = [new Set(), new Set(), new Set(), new Set([fc3])];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
    });
    // Partition 6: One bucket with multiple flashcars.
    it("handles multiple flashcards in the same bucket", () => {
        const buckets = new Map([[0, new Set([fc0, fc1, fc2])]]);
        const expected = [new Set([fc0, fc1, fc2])];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
    });
    // Partition 7: multiple buckets with multiple flashcars.
    it("handles multiple flashcards in the same bucket", () => {
        const buckets = new Map([
            [0, new Set([fc0, fc1, fc2])],
            [1, new Set([fc3, fc4])],
        ]);
        const expected = [new Set([fc0, fc1, fc2]), new Set([fc3, fc4])];
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), expected);
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
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)([]), undefined);
    });
    // partition 2: empty bucket(s)
    it("range is undefined when all buckets are empty ", () => {
        const buckets = [
            new Set(),
            new Set(),
            new Set(),
        ];
        // const buckets: Set<Flashcard>[] = [new Set(), new Set(), new Set()];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), undefined);
    });
    // partition 3: single non-empty bucket
    it("finds range for a single non-empty bucket", () => {
        const buckets = [new Set([fc0, fc1])];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 0,
            maxBucket: 0,
        });
    });
    // partition 4:  non-empty bucket only at start
    it("finds range when only first bucket is non-empty", () => {
        const buckets = [new Set([fc0]), new Set(), new Set()];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 0,
            maxBucket: 0,
        });
    });
    // partition 5:  non-empty bucket only in middle
    it("finds range when only middle bucket is non-empty", () => {
        const buckets = [new Set(), new Set([fc0]), new Set()];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 1,
            maxBucket: 1,
        });
    });
    // partition 6:  non-empty bucket only at end
    it("finds range when only last bucket is non-empty", () => {
        const buckets = [new Set(), new Set(), new Set([fc0])];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 2,
            maxBucket: 2,
        });
    });
    // partition 7:  multiple non-empty buckets.
    it("finds range for multiple non-empty buckets", () => {
        const buckets = [
            new Set(),
            new Set(),
            new Set([fc0]),
            new Set(),
            new Set([fc3]),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 2,
            maxBucket: 4,
        });
    });
    // partition 8: Non-empty buckets only at the edges
    it("finds range when non-empty buckets are only at the edges", () => {
        const buckets = [
            new Set([fc0]),
            new Set(),
            new Set(),
            new Set([fc3]),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 0,
            maxBucket: 3,
        });
    });
    // partition 9: all non-empty buckets
    it("finds range when all buckets are non-empty", () => {
        const buckets = [
            new Set([fc0]),
            new Set([fc2]),
            new Set([fc3]),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            minBucket: 0,
            maxBucket: 2,
        });
    });
    it("undefined when undefined", () => {
        const buckets = [
            new Set(undefined),
            new Set(undefined),
            new Set(undefined),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), {
            undefined
        });
    });
});
/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
