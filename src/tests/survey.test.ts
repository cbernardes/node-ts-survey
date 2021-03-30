
import surveyCheck from '../survey';
 

describe('Survey', () => {
  it('check 1', () => {
    const output = surveyCheck('./example-data/survey-1.csv', './example-data/survey-1-responses.csv');
    expect(output).toBeTruthy();
    expect(output.answers.length).toBe(6);
    expect(output.participantsPerce).toBe(83.33);
    expect(output.totalParticipants).toBe(5);
    expect(output.rating).toBeTruthy();

    Object.keys(output.rating).forEach((key, index) => {
      expect(output.rating[key]['avg']).toBeGreaterThanOrEqual(1);
      expect(output.rating[key]['avg']).toBeLessThanOrEqual(5);
      if (index === 0){
        expect(output.rating[key]['avg']).toBe(4.6);
      }
    });
  });

  it('check 2', () => {
    const output = surveyCheck('./example-data/survey-2.csv', './example-data/survey-2-responses.csv');
    expect(output).toBeTruthy();
    expect(output.answers.length).toBe(5);
    expect(output.participantsPerce).toBe(100);
    expect(output.totalParticipants).toBe(5);
    expect(output.rating).toBeTruthy();

    Object.keys(output.rating).forEach((key, index) => {
      expect(output.rating[key]['avg']).toBeGreaterThanOrEqual(1);
      expect(output.rating[key]['avg']).toBeLessThanOrEqual(5);
      if (index === 0){
        expect(output.rating[key]['avg']).toBe(4.6);
      }
    });
  });


  it('check 3', () => {
    const output = surveyCheck('./example-data/survey-3.csv', './example-data/survey-3-responses.csv');
    expect(output).toBeTruthy();
    expect(output.answers.length).toBe(5);
    expect(output.participantsPerce).toBe(0);
    expect(output.totalParticipants).toBe(0);
    expect(Object.keys(output.rating).length).toBe(0);
  });

  it('empty survey', () => {
    expect(()=>{ surveyCheck('./example-data/empty.csv', './example-data/survey-3-responses.csv') }).toThrowError('Empty survey');
    expect(()=>{ surveyCheck('./example-data/survey-3-responses.csv', './example-data/empty.csv') }).toThrowError('Empty survey');
    expect(()=>{ surveyCheck('./example-data/survey-1.csv', './example-data/survey-only-1-response.csv') }).not.toThrow();
  });

  it('invalid file', () => {
    expect(()=>{ surveyCheck('test', 'invalid') }).toThrowError('ENOENT: no such file or directory, open \'test\'');
  });

  it('check only 1 anwer', () => {
    const output = surveyCheck('./example-data/survey-1.csv', './example-data/survey-only-1-response.csv');
    expect(output).toBeTruthy();
    expect(output.answers.length).toBe(1);
    expect(output.participantsPerce).toBe(100);
    expect(output.totalParticipants).toBe(1);
    
    Object.keys(output.rating).forEach((key, index) => {
      expect(output.rating[key]['avg']).toBeGreaterThanOrEqual(1);
      expect(output.rating[key]['avg']).toBeLessThanOrEqual(5);
      if (index === 0){
        expect(output.rating[key]['avg']).toBe(5);
      }
    });
  });
});