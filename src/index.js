const DEFAULT_WORDS_PER_MINUTE = 225;

function assertString(value, name = "text") {
  if (typeof value !== "string") {
    throw new TypeError(`Expected ${name} to be a string`);
  }
}

function assertLocale(locale) {
  if (locale !== undefined && typeof locale !== "string") {
    throw new TypeError("Expected locale to be a string");
  }
}

function getSegmenter(locale, granularity) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return new Intl.Segmenter(locale, { granularity });
  }

  return null;
}

function fallbackWordCount(text) {
  const matches = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}

function fallbackSentenceCount(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return 0;
  }

  const matches = trimmed.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/gu);
  return matches ? matches.filter((value) => value.trim()).length : 0;
}

export function countWords(text, options = {}) {
  assertString(text);
  const { locale } = options;
  assertLocale(locale);

  if (!text.trim()) {
    return 0;
  }

  const segmenter = getSegmenter(locale, "word");

  if (!segmenter) {
    return fallbackWordCount(text);
  }

  let count = 0;

  for (const segment of segmenter.segment(text)) {
    if (segment.isWordLike) {
      count += 1;
    }
  }

  return count;
}

export function countCharacters(text, options = {}) {
  assertString(text);
  const { locale, whitespace = true } = options;
  assertLocale(locale);

  if (typeof whitespace !== "boolean") {
    throw new TypeError("Expected whitespace to be a boolean");
  }

  const value = whitespace ? text : text.replace(/\s/gu, "");

  if (!value) {
    return 0;
  }

  const segmenter = getSegmenter(locale, "grapheme");

  if (segmenter) {
    let count = 0;

    for (const _segment of segmenter.segment(value)) {
      count += 1;
    }

    return count;
  }

  return Array.from(value).length;
}

export function countSentences(text, options = {}) {
  assertString(text);
  const { locale } = options;
  assertLocale(locale);

  if (!text.trim()) {
    return 0;
  }

  const segmenter = getSegmenter(locale, "sentence");

  if (!segmenter) {
    return fallbackSentenceCount(text);
  }

  let count = 0;

  for (const segment of segmenter.segment(text)) {
    if (segment.segment.trim()) {
      count += 1;
    }
  }

  return count;
}

export function countParagraphs(text) {
  assertString(text);

  const normalized = text.replace(/\r\n?/gu, "\n").trim();

  if (!normalized) {
    return 0;
  }

  return normalized
    .split(/\n[ \t]*\n+/gu)
    .filter((paragraph) => paragraph.trim().length > 0)
    .length;
}

export function estimateReadingTime(text, options = {}) {
  assertString(text);

  const {
    locale,
    wordsPerMinute = DEFAULT_WORDS_PER_MINUTE
  } = options;

  assertLocale(locale);

  if (
    typeof wordsPerMinute !== "number" ||
    !Number.isFinite(wordsPerMinute) ||
    wordsPerMinute <= 0
  ) {
    throw new RangeError("Expected wordsPerMinute to be a positive finite number");
  }

  const words = countWords(text, { locale });
  const minutes = words / wordsPerMinute;

  return {
    words,
    minutes,
    roundedMinutes: words === 0 ? 0 : Math.max(1, Math.ceil(minutes)),
    wordsPerMinute
  };
}

export function analyzeText(text, options = {}) {
  assertString(text);

  const {
    locale,
    wordsPerMinute = DEFAULT_WORDS_PER_MINUTE
  } = options;

  assertLocale(locale);

  if (
    typeof wordsPerMinute !== "number" ||
    !Number.isFinite(wordsPerMinute) ||
    wordsPerMinute <= 0
  ) {
    throw new RangeError("Expected wordsPerMinute to be a positive finite number");
  }

  const words = countWords(text, { locale });
  const characters = countCharacters(text, { locale });
  const charactersWithoutWhitespace = countCharacters(text, {
    locale,
    whitespace: false
  });
  const sentences = countSentences(text, { locale });
  const paragraphs = countParagraphs(text);
  const minutes = words / wordsPerMinute;

  return {
    words,
    characters,
    charactersWithoutWhitespace,
    sentences,
    paragraphs,
    readingTime: {
      words,
      minutes,
      roundedMinutes: words === 0 ? 0 : Math.max(1, Math.ceil(minutes)),
      wordsPerMinute
    }
  };
}
