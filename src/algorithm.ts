/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the Didit autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  if (buckets.size === 0) return [];

  const maxBucketNum = Math.max(...buckets.keys(), 0);

  const bucketArray: Array<Set<Flashcard>> = Array.from(
    { length: maxBucketNum + 1 },
    () => new Set<Flashcard>()
  );

  for (const [bucket, cards] of buckets.entries()) {
    bucketArray[bucket] = new Set(cards);
  }

  return bucketArray;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  if (buckets.length === 0 || buckets.every((bucket) => bucket.size === 0))
    return undefined;

  let minBucket = -1;
  let maxBucket = -1;

  let i = 0;
  while (i < buckets.length) {
    if (buckets[i]!.size > 0) {
      minBucket = i;
      break;
    } else i++;
  }

  let j = buckets.length - 1;
  while (minBucket != -1 && j >= minBucket) {
    if (buckets[j] != undefined && buckets[j]!.size > 0) {
      maxBucket = j;
      break;
    } else j--;
  }

  return { minBucket, maxBucket };

  // this function could have had a simpler implementation but i kept this one for the sake of avoiding plagiarism:)
  // improved code:
  // let min = -1;
  // let max = -1;

  // for (let i = 0; i < buckets.length; i++) {
  //   if (buckets[i]!.size > 0) {
  //     if (min === -1) min = i;
  //     max = i;
  //   }
  // }

  // return min === -1 ? undefined : { minBucket: min, maxBucket: max };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();

  const retiredBucketIndex = buckets.length - 1;

  for (let i = 0; i < retiredBucketIndex; i++) {
    // since the numbering of days starts from 0, every n'th practice day will be day:n-1
    if ((day + 1) % Math.pow(2, i) === 0) {
      for (const flashcard of buckets[i]!) {
        practiceSet.add(flashcard);
      }
    }
  }
  return practiceSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  // clone the original map
  const updatedBuckets: BucketMap = new Map();
  for (const [bucket, set] of buckets.entries()) {
    updatedBuckets.set(bucket, new Set(set));
  }

  // find current bucket which has the flashcard
  let currentBucket = -1;
  for (const [bucket, cardSet] of updatedBuckets.entries()) {
    if (cardSet.has(card)) {
      currentBucket = bucket;
      cardSet.delete(card); // remove the card from current bucket
      break;
    }
  }

  if (currentBucket === -1) {
    throw new Error("no bucket contains this card");
  }

  const maxBucket = Math.max(...buckets.keys());

  // pick new bucket based on difficulty
  let newBucket = currentBucket;
  if (difficulty === AnswerDifficulty.Wrong) {
    newBucket = 0;
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = Math.max(0, currentBucket - 1);
  } else if (difficulty === AnswerDifficulty.Easy) {
    newBucket = Math.min(currentBucket + 1, maxBucket);
  }

  // add the card to the new bucket
  if (!buckets.has(newBucket)) {
    updatedBuckets.set(newBucket, new Set());
  }
  updatedBuckets.get(newBucket)!.add(card);

  return updatedBuckets;
}

/**
 * Generates a helpful hint for a flashcard.
 *
 * If the flashcard.hint is non-empty, it is returned as the hint
 * otherwise, reveal first few characters of the answer as a hint
 * For the same flashcard, consistent output is guaranateed.
 *
 * @param card flashcard to hint
 * @returns a helpful deterministic hint string
 * @spec.requires card is a valid Flashcard.
 * @spec.ensures result is card.hint if card.hint !== ""
 * @spec.ensures result is a non-empty substring of card.back if card.hint is ""
 */
export function getHint(card: Flashcard): string {
  if (card.hint !== "") {
    return card.hint;
  }

  // if no hint available: use a start substring of the answer as hint
  const trimmedBack = card.back.trim();
  if (trimmedBack.length === 0) return "(no hint available)";

  const previewLength = Math.min(5, trimmedBack.length);
  return `Starts with '${trimmedBack.slice(0, previewLength)}'`;
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: any, history: any): any {
  // Replace 'any' with appropriate types
  // TODO: Implement this function (and define the spec!)
  throw new Error("Implement me!");
}
