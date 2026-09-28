import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeText,
  countCharacters,
  countParagraphs,
  countSentences,
  countWords,
  estimateReadingTime
} from "../src/index.js";

test("countWords counts ordinary words", () => {
  assert.equal(countWords("Hello world"), 2);
});

test("countWords ignores repeated whitespace", () => {
  assert.equal(countWords("hello   \n\tworld"), 2);
});

test("countWords handles contractions as word-like text", () => {
  assert.equal(countWords("don't stop"), 2);
});

test("countWords handles Unicode text", () => {
  assert.equal(countWords("café naïve résumé"), 3);
});

test("countWords returns zero for empty or whitespace-only text", () => {
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   \n\t"), 0);
});

test("countCharacters counts basic characters", () => {
  assert.equal(countCharacters("hello"), 5);
});

test("countCharacters can exclude whitespace", () => {
  assert.equal(countCharacters("hello world", { whitespace: false }), 10);
});

test("countCharacters treats emoji as grapheme clusters when supported", () => {
  assert.equal(countCharacters("👍🏽"), 1);
});

test("countSentences counts sentence-like segments", () => {
  assert.equal(countSentences("Hello. How are you? Great!"), 3);
});

test("countSentences returns zero for empty text", () => {
  assert.equal(countSentences("  "), 0);
});

test("countParagraphs handles LF separators", () => {
  assert.equal(countParagraphs("One.\n\nTwo."), 2);
});

test("countParagraphs handles CRLF separators", () => {
  assert.equal(countParagraphs("One.\r\n\r\nTwo."), 2);
});

test("countParagraphs ignores repeated blank lines", () => {
  assert.equal(countParagraphs("One.\n\n\n\nTwo."), 2);
});

test("estimateReadingTime uses the default WPM", () => {
  const result = estimateReadingTime("one two three");

  assert.equal(result.words, 3);
  assert.equal(result.wordsPerMinute, 225);
  assert.equal(result.roundedMinutes, 1);
});

test("estimateReadingTime accepts custom WPM", () => {
  const result = estimateReadingTime("one two three four", {
    wordsPerMinute: 2
  });

  assert.equal(result.minutes, 2);
  assert.equal(result.roundedMinutes, 2);
});

test("estimateReadingTime returns zero rounded minutes for empty text", () => {
  assert.equal(estimateReadingTime("").roundedMinutes, 0);
});

test("analyzeText returns the complete analysis shape", () => {
  const result = analyzeText("Hello world. This is open.text.");

  assert.equal(result.words, 5);
  assert.equal(result.characters, 31);
  assert.equal(result.charactersWithoutWhitespace, 27);
  assert.equal(result.sentences, 2);
  assert.equal(result.paragraphs, 1);
  assert.equal(result.readingTime.words, 5);
  assert.equal(result.readingTime.wordsPerMinute, 225);
});

test("invalid text input throws TypeError", () => {
  assert.throws(() => countWords(null), TypeError);
  assert.throws(() => countCharacters(42), TypeError);
  assert.throws(() => countSentences({}), TypeError);
  assert.throws(() => countParagraphs([]), TypeError);
});

test("invalid character whitespace option throws TypeError", () => {
  assert.throws(
    () => countCharacters("hello", { whitespace: "no" }),
    TypeError
  );
});

test("invalid locale option throws TypeError", () => {
  assert.throws(() => countWords("hello", { locale: 42 }), TypeError);
});

test("invalid reading speed throws RangeError", () => {
  assert.throws(
    () => estimateReadingTime("hello", { wordsPerMinute: 0 }),
    RangeError
  );

  assert.throws(
    () => analyzeText("hello", { wordsPerMinute: Number.NaN }),
    RangeError
  );
});
