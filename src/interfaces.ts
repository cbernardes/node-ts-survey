export enum questionType {
  rating = 'ratingquestion',
  select = 'singleselect'
}

export interface Survey {
    theme?: string,
    type?: string,
    text?: string,
}


export interface SurveyResponse {
  email?: string,
  employee_id: string,
  submitted_at?: Date,
  answers?: Array<Answer>,
}


export interface Answer {
  question: string,
  answer?: number | string,
}