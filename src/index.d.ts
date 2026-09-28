export interface LocaleOptions {
  locale?: string;
}

export interface CharacterCountOptions extends LocaleOptions {
  whitespace?: boolean;
}

export interface ReadingTimeOptions extends LocaleOptions {
  wordsPerMinute?: number;
}

export interface ReadingTimeResult {
  words: number;
  minutes: number;
  roundedMinutes: number;
  wordsPerMinute: number;
}

export interface TextAnalysis {
  words: number;
  characters: number;
  charactersWithoutWhitespace: number;
  sentences: number;
  paragraphs: number;
  readingTime: ReadingTimeResult;
}

export function countWords(
  text: string,
  options?: LocaleOptions
): number;

export function countCharacters(
  text: string,
  options?: CharacterCountOptions
): number;

export function countSentences(
  text: string,
  options?: LocaleOptions
): number;

export function countParagraphs(text: string): number;

export function estimateReadingTime(
  text: string,
  options?: ReadingTimeOptions
): ReadingTimeResult;

export function analyzeText(
  text: string,
  options?: ReadingTimeOptions
): TextAnalysis;
