export type Category =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'T'
  | 'AM'
  | 'A1'
  | 'A2'
  | 'B1'
  | 'C1'
  | 'D1';

export interface Question {
  id: string;

  /** Question name */
  n: string;

  /** Media */
  m: string;

  /** Is basic */
  iB: boolean;

  /** Points */
  p: number;

  /** Categories */
  ca: Category[];

  /** Block */
  b: string;

  /** Law */
  l: string;

  /** Asking for */
  a: string;

  /** Safety */
  sa: string;

  /** Status */
  st: string;

  /** Entity */
  e: string;
}

export interface YesOrNoQuestion extends Question {
  /** Correct answer */
  c: 'T' | 'N';
}

export interface ABCQuestion extends Question {
  /** Correct answer */
  c: 'A' | 'B' | 'C';
}

export type AnyQuestion = YesOrNoQuestion | ABCQuestion;

export interface QuestionTranslation {
  /** Question text */
  q: string;
}

export type YesOrNoQuestionTranslation = QuestionTranslation;

export interface ABCQuestionTranslation extends QuestionTranslation {
  /** Answer A text */
  a: string;

  /** Answer B text */
  b: string;

  /** Answer C text */
  c: string;
}

export type AnyQuestionTranslation =
  | YesOrNoQuestionTranslation
  | ABCQuestionTranslation;
