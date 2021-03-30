import surveyCheck from './survey';
import { exit } from 'process';


const [surveyPath, responsesPath] = process.argv.slice(2);

//calling the method
try {
  const { answers, participantsPerce, totalParticipants, rating } = surveyCheck (surveyPath, responsesPath);
  const outputAnswers = Object.keys(rating).map((key) => {
    return `\n${key}: ${rating[key]['avg']}`
  });

  console.log(`Survey output -> Total responses: ${answers.length}\nParticipannts -> percentage: ${participantsPerce}% total: ${totalParticipants}\n\nAnswersAvg:${outputAnswers}`);
  
} catch (err) {
  console.log(err);
  exit(1);
}