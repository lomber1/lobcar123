import * as cheerio from 'cheerio';

const QUESTIONS_URL = 'https://www.gov.pl/web/infrastruktura/prawo-jazdy';

// TODO:
//  2. Extract the url to question base
//  3. Download question base.
//  4. Transform data from xlsx to json
//  5. Save json file

const getPage = async (): Promise<string> => {
  const response = await fetch(QUESTIONS_URL);
  return await response.text();
}

const getQuestionBaseUrl = (html: string): string => {
  const $ = cheerio.load(html);
// //a[@download and contains(text(), 'Baza')]

};

const downloadQuestionBase = async (fileUrl: string): Promise<any> => {

};

const main = async () => {
  try {
    const pageHtml = await getPage();
    const questionBaseUrl = getQuestionBaseUrl(pageHtml);

  } catch (e) {
    console.error(e);
  }
};

main();

export {};
