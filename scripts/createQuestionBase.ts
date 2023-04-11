import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

import { AnyQuestion, AnyQuestionTranslation } from '../common/types/question';
import { getEnvOrThrow } from '../common/utils/env';

const BASE_URL = 'https://www.gov.pl';
const QUESTIONS_URL = `${BASE_URL}/web/infrastruktura/prawo-jazdy`;
const QUESTION_BASE_DIR = `${process.env.PWD}/public/questions`;

const HEADER = [
  'n',
  'id',
  'q_pl',
  'a_pl',
  'b_pl',
  'c_pl',
  'q_en',
  'a_en',
  'b_en',
  'c_en',
  'q_de',
  'a_de',
  'b_de',
  'c_de',
  'c',
  'm',
  'iB',
  'p',
  'ca',
  'b',
  'l',
  'a',
  'sa',
  'st',
  'e',
];

const LOCALES = ['pl', 'en', 'de'];

const getPage = async (): Promise<string> => {
  const response = await fetch(QUESTIONS_URL);
  return response.text();
};

const getQuestionBaseUrl = (html: string): string => {
  const $ = cheerio.load(html);
  const questionsUrl = $('a[download]:contains("Baza pytań")').attr('href');

  return `${BASE_URL}${questionsUrl}`;
};

const downloadQuestionBase = async (fileUrl: string): Promise<ArrayBuffer> => {
  const response = await fetch(fileUrl);
  return response.arrayBuffer();
};

const transformQuestionBase = async (
  file: ArrayBuffer
): Promise<AnyQuestion[]> => {
  const workbook = XLSX.read(file, { type: 'array' });

  const data = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: HEADER }
  );

  const questions: AnyQuestion[] = [];
  const translationsPerLocale: Record<
    string,
    Record<AnyQuestion['id'], AnyQuestionTranslation>
  > = {};

  data.forEach((row: any, i) => {
    // Skip header
    if (i === 0) {
      return;
    }

    const { id } = row;
    const correctAnswer = row.c;

    questions.push({
      id,
      n: row.n,
      c: correctAnswer,
      m: row.m,
      iB: row.iB === 'PODSTAWOWY',
      p: +row.p,
      ca: row.ca.split(','),
      b: row.b,
      l: row.l,
      a: row.a,
      sa: row.sa,
      st: row.st,
      e: row.e,
    });

    LOCALES.forEach((locale) => {
      if (!translationsPerLocale[locale]) {
        translationsPerLocale[locale] = {};
      }

      translationsPerLocale[locale][id] = {
        q: row[`q_${locale}`],
      };

      if ('ABC'.includes(correctAnswer)) {
        translationsPerLocale[locale][id] = {
          ...translationsPerLocale[locale][id],
          a: row[`a_${locale}`],
          b: row[`b_${locale}`],
          c: row[`c_${locale}`],
        };
      }
    });
  });

  // Save questions
  const json = JSON.stringify(questions);
  await fs.promises.mkdir(QUESTION_BASE_DIR, { recursive: true });
  await fs.promises.writeFile(
    `${QUESTION_BASE_DIR}/questionBase.json`,
    json,
    'utf8'
  );

  // Save translations
  LOCALES.forEach((locale) => {
    fs.writeFileSync(
      `${QUESTION_BASE_DIR}/questionBaseTranslations_${locale}.json`,
      JSON.stringify(translationsPerLocale[locale]),
      'utf8'
    );
  });

  return questions;
};

const checkMedia = (questions: AnyQuestion[]) => {
  const files = fs.readdirSync(getEnvOrThrow('MEDIA_PATH'));
  const failed = [];

  questions.forEach((question) => {
    const media = question.m;

    if (!files.includes(media)) {
      failed.push(media);
      console.error(`Missing media: ${media}`);
    }
  });
};

const main = async () => {
  try {
    const pageHtml = await getPage();
    const questionBaseUrl = getQuestionBaseUrl(pageHtml);
    const questionBaseXlsx = await downloadQuestionBase(questionBaseUrl);
    const questions = await transformQuestionBase(questionBaseXlsx);

    checkMedia(questions);
  } catch (e) {
    console.error(e);
  }
};

main();

export {};
