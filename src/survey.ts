import { readFileSync } from 'fs';
import { Survey, SurveyResponse, Answer, questionType } from './interfaces';
import { exit } from 'process';

const getRecordValues = (record: string): string[] => {
  if (!record) return [];
  if (record.indexOf(',"') < 0) {
    return record.split(',');
  }
  let allValues = record.split(',');
  let formattedValues = [];
  let valueText = [];
  allValues.forEach(v => {
    const total = v.replace(/[^"]/g, "").length;
    const isBuildingString = valueText.length;
    if (!isBuildingString && total === 0) {
      return formattedValues.push(v);
    }
    if (!isBuildingString && total === 2) { //strig without , in between
      return formattedValues.push(v.replace(/["']/g, ""));
    }
    if (isBuildingString && total === 1) { //end of the string
      valueText.push(v.replace('"', ''));
      formattedValues.push(valueText.join());
      valueText = [];
      return
    }
    if (!isBuildingString && total === 1) { // Not buildig yet, but has " so start it
      return valueText.push(v.replace('"', ''));
    }
    if (isBuildingString && total === 0) { // Increment the buildig string
      return valueText.push(v);
    }
    // return formattedValues.push(v); // in case it does not fall in any conditionn
  });
  return formattedValues;
}

const validateAndReadFile = (fileName: string, isSurvey: boolean = false): { schema?: string[], rows: string[] } => {
  const fileContent = readFileSync(fileName, 'utf-8');
  let rows = fileContent.split('\n');
  if (rows.length === 0 || (rows.length === 1 && rows[0].length === 0)) {
    throw new Error('Empty survey');
  }
  if (!isSurvey) {
    return { rows }
  }
  let schema = rows[0];
  return { schema: schema.split(','), rows: rows.slice(1, rows.length) }
}


export default function surveyCheck(surveyPath: string, responsesPath: string) {

  let survey = validateAndReadFile(surveyPath, true);
  let answer = validateAndReadFile(responsesPath);

  //Get all questions
  const questions: Survey[] = survey.rows.map((r) => {
    const rowValues: string[] = getRecordValues(r);
    const resp: Survey = {};
    //first line will always be a header, if the files does not have 1 line then the empty error will be thrown
    // if (!survey.schema || survey.schema.length === 0) {
    //   throw new Error('Survey without a header');
    // }
    survey.schema.forEach((key, index) => {
      resp[key] = rowValues[index];
    });
    return resp;
  }).filter((q) => {
    return q.text;
  });

  //Get all answers
  const answers: SurveyResponse[] = answer.rows.map((r) => {
    const rowValues: string[] = getRecordValues(r);
    let resp: SurveyResponse = { email: rowValues[0] || null, employee_id: rowValues[1] || null }
    resp['submitted_at'] = rowValues[2] ? new Date(rowValues[2]) : null;

    const individualAnswers: Answer[] = questions.map((q, index) => {
      return {
        question: q.text,
        answer: (q.type === questionType.rating) ? parseInt(rowValues[index + 3]) : rowValues[index + 3]
      }
    });
    resp.answers = individualAnswers;

    return resp;
  });

  // Invalid validation, if the file does not have info Empty File will be triggered
  // if (!answers.length){
  //   throw new Error('Survey without answers');
  // }


  let totalParticipants = 0;
  let totalRating = {};
  answers.forEach((a) => {
    if (a.submitted_at) {
      totalParticipants += 1;

      a.answers.forEach((subA) => {
        if (subA.answer && typeof (subA.answer) === 'number') {
          if (!totalRating[subA.question]) {
            totalRating[subA.question] = {}
          }
          totalRating[subA.question].total = totalRating[subA.question].total ? totalRating[subA.question].total + subA.answer : subA.answer;
        }
      });
    }
  });
  Object.keys(totalRating).forEach((key) => {
    totalRating[key]['avg'] = totalParticipants === 0 ? 0 : totalRating[key].total / totalParticipants;
  });
  const participantsPerce = parseFloat((totalParticipants / answers.length * 100).toFixed(2));

return { answers, participantsPerce, totalParticipants, rating: totalRating };

}