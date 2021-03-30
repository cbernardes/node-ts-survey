

import { readFileSync, writeFile } from 'fs';
import { Survey, SurveyResponse, Answer , questionType} from './interfaces';
import { exit } from 'process';

const [surveyPath, responsesPath] = process.argv.slice(2);

const getRecordValues = (record: string): string[] => {
  if (!record) return [];
  if (!record.indexOf(',"')) {
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
    return formattedValues.push(v); // in case it does not fall in any conditionn
  });
  return formattedValues;
}

const validateAndReadFile = (fileName: string, isSurvey: boolean = false): { schema?: string[], rows: string[] } => {
  const fileContent = readFileSync(fileName, 'utf-8');
  let rows = fileContent.split('\n');
  if (!rows.length) {
    console.error('Empty survey');
    exit(1);
  }
  if (!isSurvey) {
    return { rows }
  }
  let schema = rows[0];
  return { schema: schema.split(','), rows: rows.slice(1, rows.length) }
}


export default function surveyCheck (surveyPath: string, responsesPath: string){

  try {
    let survey = validateAndReadFile(surveyPath, true);
    let answer = validateAndReadFile(responsesPath);

    //Get all questions
    const questions: Survey[] = survey.rows.map((r) => {
      const rowValues: string[] = getRecordValues(r);
      const resp: Survey = {};
      if (!survey.schema || !survey.schema.length) {
        console.error('Survey without a header');
        exit(1);
      }
      survey.schema.forEach((key, index) => {
        resp[key] = rowValues[index];
      });
      return resp;
    });

    //Get all answers
    const answers: SurveyResponse[] = answer.rows.map((r) => {
      const rowValues: string[] = getRecordValues(r);
      let resp: SurveyResponse = { email: rowValues[0] || null, employee_id: rowValues[1] }
      resp['submitted_at'] = rowValues[2] ? new Date(rowValues[2]) : null;

      const individualAnswers: Answer[] = questions.map((q, index) => {
        return {
          question: q.text, 
          answer: (q.type === questionType.rating) ? parseInt(rowValues[index+3]) : rowValues[index+3]
        }
      });
      resp.answers = individualAnswers;

      return resp;
    });
    if (!answers.length){
      console.log('Survey without answers');
      exit(-1);
    }



    let totalParticipants = 0;
    let totalRating = {};
    answers.forEach((a)=>{
      if (a.submitted_at){
        totalParticipants +=1;

        a.answers.forEach((subA)=>{
          if (subA.answer && typeof(subA.answer) === 'number'){
            totalRating[subA.question] = totalRating[subA.question] ? totalRating[subA.question]+subA.answer : subA.answer; 
          }
        });
      }
    });
    const participantsPerce = (totalParticipants/answers.length*100).toFixed(2);
    const outputAnswers = Object.keys(totalRating).map((key)=>{
      return `\n${key}: ${totalParticipants === 0 ? 0 : totalRating[key]/totalParticipants}`
    });

    console.log(`Survey output -> Total responses: ${answers.length}\nParticipannts -> percentage: ${participantsPerce}% total: ${totalParticipants}\n\nAnswersAvg:${outputAnswers}`);
    return {totalResp: answers.length, participantsPerce, totalParticipants, outputAnswers};
  } catch (err) {
    console.error(err);
    exit(1);
  }
}

//calling the method
surveyCheck (surveyPath, responsesPath);