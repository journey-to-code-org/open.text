# open.text

Small, dependency-free text analysis utilities for browsers and Node.js.

`open.text` provides focused helpers for counting words, characters, sentences,
and paragraphs, estimating reading time, and producing a compact summary of a
piece of plain text.

## Install

```bash
npm install @journey-to-code/open-text
```

## Usage

```js
import {
  countWords,
  countCharacters,
  countSentences,
  countParagraphs,
  estimateReadingTime,
  analyzeText
} from "@journey-to-code/open-text";

const text = "Hello world. This is open.text.";

countWords(text); // 5
countCharacters(text); // 31
countSentences(text); // 2
countParagraphs(text); // 1

estimateReadingTime(text);
// {
//   words: 5,
//   minutes: 0.022222222222222223,
//   roundedMinutes: 1,
//   wordsPerMinute: 225
// }

analyzeText(text);
// {
//   words: 5,
//   characters: 31,
//   charactersWithoutWhitespace: 27,
//   sentences: 2,
//   paragraphs: 1,
//   readingTime: {
//     words: 5,
//     minutes: 0.022222222222222223,
//     roundedMinutes: 1,
//     wordsPerMinute: 225
//   }
// }
```

## API

### `countWords(text, options?)`

Counts word-like segments in a string.

```js
countWords("don't stop"); // 2
```

Options:

```js
countWords(text, { locale: "en" });
```

The implementation uses `Intl.Segmenter` when available and a Unicode-aware
fallback otherwise.

### `countCharacters(text, options?)`

Counts user-perceived characters (grapheme clusters) when `Intl.Segmenter` is
available, with a Unicode code-point fallback.

```js
countCharacters("hello"); // 5
countCharacters("hello world", { whitespace: false }); // 10
```

Options:

- `locale` — locale hint used by `Intl.Segmenter`.
- `whitespace` — defaults to `true`; set to `false` to exclude whitespace.

### `countSentences(text, options?)`

Counts sentence-like segments.

```js
countSentences("Hello. How are you? Great!"); // 3
```

Sentence detection is intentionally heuristic. `open.text` is not a full NLP
sentence tokenizer.

### `countParagraphs(text)`

Counts non-empty paragraph blocks separated by one or more blank lines.

```js
countParagraphs("One paragraph.\n\nAnother paragraph."); // 2
```

Both LF and CRLF input are normalized.

### `estimateReadingTime(text, options?)`

Estimates reading time from word count.

```js
estimateReadingTime(text, { wordsPerMinute: 200 });
```

Returns:

```js
{
  words,
  minutes,
  roundedMinutes,
  wordsPerMinute
}
```

The default reading speed is `225` words per minute.

### `analyzeText(text, options?)`

Returns a complete analysis object.

```js
analyzeText(text, {
  locale: "en",
  wordsPerMinute: 225
});
```

## Input behavior

All public functions require a string.

```js
countWords(""); // 0
countWords("   "); // 0
countWords(null); // TypeError
```

The library does not silently coerce non-string input.

## Scope

`open.text` analyzes plain text.

It deliberately does not parse or understand:

- Markdown
- HTML
- frontmatter
- source code
- URLs
- sentiment
- keywords
- readability grades
- LLM tokens

Those concerns belong in higher-level tools.

## Runtime

- Node.js 18+
- modern browsers
- ES modules
- zero runtime dependencies

## Development

```bash
npm test
```

## License

MIT
